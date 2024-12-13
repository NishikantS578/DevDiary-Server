const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    IsAccountVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    Otp: {
        type: String,
    },
    OtpExpiry: {
        type: Date,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;