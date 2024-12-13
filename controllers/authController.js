const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const transporter = require("../config/nodemailer");

async function login(req, res, next) {
    try {
        const data = req.body;

        if (!data.email || !data.p) {
            throw new Error("missing details");
        }

        const user = await User.findOne({ Email: data.email });

        if (!user) {
            throw new Error("user does not exists");
        }

        const passwordMatch = await bcrypt.compare(data.p, user.Password);

        if (!passwordMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV == "production", sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ success: true, msg: "login successfull" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Error while user login!" });
    }
}

async function register(req, res, next) {
    try {
        const data = req.body;

        if (!data.email || !data.p) {
            throw new Error("Missing details");
        }

        const hashedPassword = await bcrypt.hash(data.p, 10);

        const otp = Math.floor(Math.random() * 1000000);

        const user = await User.create({ Email: data.email, Password: hashedPassword, Otp: otp.toString() });

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

        res.status(200).json({ success: true, msg: "registration successfull" });
    } catch (err) {
        let msg = "Error while user login!";

        console.log(err.message);
        res.status(500).json({ success: false, msg });
    }
}

async function logout(req, res, next) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
        });

        res.status(200).json({ success: true, msg: "logged out successfully" });
    } catch (err) {
        let msg = "Error while user login!";

        console.log(err.message);
        res.status(500).json({ success: false, msg });
    }
}

async function sendOtp(req, res, next) {
    try {
        const cookies = req.cookies;

        if (!cookies.token) {
            throw new Error("missing credential");
        }

        const userId = jwt.decode(cookies.token).id;

        let user = await User.findById(userId);

        if (!user) {
            throw new Error("User does not exists");
        }

        const otp = Math.floor(Math.random() * 1000000);

        user = await User.findByIdAndUpdate(userId, { Otp: otp.toString(), OtpExpiry: Date.now() + 5 * 60 * 1000 });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.Email,
            subject: 'Welcome to DevDiary',
            text: `<h2>Welcome to DevDiary. Your account has been created with email id: ${user.Email}</h2><h2>Otp: <strong>${otp}</strong></h2><p>Note this OTP is valid for 5 minutes.</p>`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, msg: "registration successfull" });
    } catch (err) {
        let msg = "Error while user login!";

        console.log(err);
        return res.status(500).json({ success: false, msg });
    }
}

module.exports = { login, register, logout, sendOtp };