const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR=10;


const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {

        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  role:{
    type:String,
    enum:["normal",'admin','superAdmin'],
    default:"normal"
    },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(this.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        this.password = hash;
        next();
    });
});
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre('findByIdAndUpdate',function(next){
  this.updatedAt=Date.now;
  return next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
