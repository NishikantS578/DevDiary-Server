const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const transporter = require("../config/nodemailer");
const bcrypt = require("bcrypt");

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
        const { email, otp } = req.body;

        if (!otp) {
            throw new Error("missing otp");
        }

        let user;

        if (cookies.token) {
            const userId = jwt.decode(cookies.token).id;

            user = await User.findById(userId);
        }
        else if (email) {
            user = await User.findOne({ Email: email });
        }
        else {
            throw new Error("no login credential");
        }

        if (!user) {
            throw new Error("User does not exists");
        }

        if (user.Otp != otp) {
            throw new Error("incorrect otp");
        }

        if (user.OtpExpiry < Date.now()) {
            throw new Error("otp expired");
        }

        await User.findByIdAndUpdate(user._id, { IsAccountVerified: true });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token",
            token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        );

        return res.status(200).json({ success: true, msg: "user verified successfully", userData: { email: user.Email } });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, msg: "Error while verifying user!" });
    }
}

async function sendPasswordResetOtp(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("missing email");
        }

        let user = await User.findOne({ Email: email });

        if (!user) {
            throw new Error("User does not exists");
        }

        const otp = Math.floor(Math.random() * 1000000);

        user = await User.findByIdAndUpdate(user._id, { Otp: otp.toString(), OtpExpiry: Date.now() + 5 * 60 * 1000 });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.Email,
            subject: 'DevDiary - Reset Password',
            text: `<h2>Request for password reset from account has been received with email id: ${user.Email}</h2><h2>Otp: <strong>${otp}</strong></h2><p>Note this OTP is valid for 5 minutes.</p>`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, msg: "otp successfully sent" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, msg: "Error while sending otp!" });
    }
}

async function updatePassword(req, res, next) {
    try {
        const { p } = req.body;
        const { token } = req.cookies;

        if (!p) {
            throw new Error("missing password");
        }

        const userId = jwt.decode(token).id;

        const password = await bcrypt.hash(p, 10);

        const user = await User.findByIdAndUpdate(userId, { Password: password });

        return res.status(200).json({ success: true, msg: "password updated successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, msg: "Error while updating password!" });
    }
}

module.exports = { getUser, verifyUser, sendPasswordResetOtp, updatePassword };