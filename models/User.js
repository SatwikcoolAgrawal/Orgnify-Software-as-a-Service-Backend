const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Custom password validator function
const passwordValidator = function (value) {
    // Password must contain at least one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(value);
};

// Define the 'User' schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["normal", 'admin', 'superAdmin'],
        default: "normal",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    this.updatedAt = Date.now();
    if (!this.isModified('password')) {
        return next();
    }
    try {
        if (!passwordValidator(this.password)) throw {status: 400 , message: "password does not match required pattern"}; 
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(this.password, salt);

        // Override the cleartext password with the hashed one
        this.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

userSchema.pre('findByIdAndUpdate',async function(next){
    this.updatedAt=Date.now();
    if (!this.isModified('password')) {
        return next();
    }
    try {
        if (!passwordValidator(this.password)) throw {status: 400 , message: "password does not match required pattern"}; 
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(this.password, salt);

        // Override the cleartext password with the hashed one
        this.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
})



// Create the 'User' model based on the defined schema
const User = mongoose.model('User', userSchema);

// Export the 'User' model for use in other modules
module.exports = User;
