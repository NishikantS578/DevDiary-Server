const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

async function getUser(req, res, next) {
    try {
        const cookies = req.cookies;

        if (!cookies.token) {
            throw new Error("no login credential");
        }

        const userId = jwt.decode(cookies.token).id;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User does not exists");
        }

        return res.status(200).json({ success: true, msg: "user data retrieved successfully", userData: { email: user.Email, isAccountVerified: user.IsAccountVerified } });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, msg: "Error while retrieving user data!" });
    }
}

async function verifyUser(req, res, next) {
    try {
        const cookies = req.cookies;
        const { otp } = req.body;

        if (!otp) {
            throw new Error("missing otp");
        }

        if (!cookies.token) {
            throw new Error("no login credential");
        }

        const userId = jwt.decode(cookies.token).id;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User does not exists");
        }

        console.log(user.Otp, otp);
        if (user.Otp != otp) {
            throw new Error("incorrect otp");
        }

        if (user.OtpExpiry < Date.now()) {
            throw new Error("otp expired");
        }

        await User.findByIdAndUpdate(userId, { IsAccountVerified: true });

        return res.status(200).json({ success: true, msg: "user verified successfully", userData: { email: user.Email } });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, msg: "Error while verifying user!" });
    }
}

module.exports = { getUser, verifyUser };