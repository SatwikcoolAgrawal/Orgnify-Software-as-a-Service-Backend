const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

/**
 * Represents the schema for a user.
 * @typedef {Object} UserSchema
 * @property {String} name - The name of the user.
 * @property {String} email - The email address of the user.
 * @property {String} password - The hashed password of the user.
 * @property {String} role - The role of the user (e.g., 'normal', 'admin', 'superAdmin').
 * @property {Date} createdAt - The date and time when the user was created.
 * @property {Date} updatedAt - The date and time when the user was last updated.
 */

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
        if (!passwordValidator(this.password)) {
            throw { status: 400, message: "Password does not match the required pattern" };
        }
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(this.password, salt);

        // Override the cleartext password with the hashed one
        this.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

// Update the password before updating the user
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this._update;
    console.log(update);
    // If the password is not being modified, no need to hash it
    if (!update || !update.password) {
        return next();
    }

    try {
        if (!passwordValidator(update.password)) {
            throw { status: 400, message: "Password does not match the required pattern" };
        }

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(update.password, salt);

        // Override the cleartext password with the hashed one
        this._update.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

// Create the 'User' model based on the defined schema
const User = mongoose.model('User', userSchema);

// Export the 'User' model for use in other modules
module.exports = User;
