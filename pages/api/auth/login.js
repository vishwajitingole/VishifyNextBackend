// pages/api/auth/login.js
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";

function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Only POST allowed" });

    await dbConnect();

    const { phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user)
            return res.status(401).json({ message: "Invalid phone number or password" });

        if (user.password !== password)
            return res.status(401).json({ message: "Invalid phone number or password" });

        if (user.status === "blocked")
            return res.status(403).json({ message: "Your account has been blocked." });

        user.lastSeen = new Date();
        await user.save();

        return res.status(200).json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Server error during login", error: err.message });
    }
}