// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     firstname: { type: String, required: true },
//     lastname: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     username: { type: String, required: true, unique: true },
//     mobilenumber: { type: String, required: true, unique: true},
//     // status: { type: Boolean, default: false }, // Default status is 'active'
//     // role: { type: Number, default: 0 }, // Default role is 'user'
//     // profilePicture: { type: String, default: '' }, // URL to profile picture
//     // address: { type: String, default: '' }, // User's address
//     // dateOfBirth: { type: Date, default: null }, // User's date of birth
//     // lastLogin: { type: Date, default: null }, // Timestamp of last login
//     // isVerified: { type: Boolean, default: false }, // Verification status
//     // verificationToken: { type: String, default: '' }, // Token for email verification
//     // resetPasswordToken: { type: String, default: '' }, // Token for password reset
//     // resetPasswordExpires: { type: Date, default: null }, // Expiry date for password reset token
//     // securityQuestions: [{
//     //     question: { type: String, required: true },
//     //     answer: { type: String, required: true }
//     // }], // Array of security questions and answers
//     // twoFactorEnabled: { type: Boolean, default: false }, // Two-factor authentication status
//     // createdAt: { type: Date, default: Date.now }, // Timestamp of user creation
//     // updatedAt: { type: Date, default: null } // Timestamp of last update

// },{collection: 'users', _id: false, timestamps: true});

// const User = mongoose.model('User', userSchema);
// module.exports = User;

const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: {
      type: String, 
    },
    email: { type: String, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mobilenumber: { type: String, required: true, unique: true },
    status: { type: Number, default: 0 }, // Default status is 'active' 
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'userRoles'}, // Default role is
    user: {type: Number, default:0},//(0: user, 1: admin, 2: superadmin),
    token: { type: String, default: '' }, // JWT token for authentication
    profilePicture: { type: String, default: '' }, // URL to profile picture
    address: { type: String, default: '' }, // User's address
    dateOfBirth: { type: Date, default: null }, // User's date of birth
    lastLogin: { type: Date, default: null }, // Timestamp of last login
    isVerified: { type: Boolean, default: false }, // Verification status
    verificationToken: { type: String, default: '' }, // Token for email verification
    resetPasswordToken: { type: String, default: '' }, // Token for password reset
    resetPasswordExpires: { type: Date, default: null }, // Expiry date for
    // password reset token
    // securityQuestions: [{
    //   question: { type: String, required: true },
    //   answer: { type: String, required: true }    
    // }], // Array of security questions and answers
    twoFactorEnabled: { type: Boolean, default: false }, // Two-factor authentication status
    createdAt: { type: Date, default: Date.now }, // Timestamp of user creation
    updatedAt: { type: Date, default: null }, // Timestamp of last update
    createdBy: { type: String, required: true }, // User who created the category
    updatedBy: { type: String, required: false }, // User who last updated the
  },
  {
    collection: 'users',
    _id: true,
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;