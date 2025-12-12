// pages/api/auth/register.js
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

    const { phoneNumber, email, password } = req.body;

    try {
        const exists = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (exists)
            return res.status(400).json({
                message: "User with this email or phone number already exists",
            });

        const user = await User.create({ phoneNumber, email, password });

        return res.status(201).json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error during registration",
            error: err.message,
        });
    }
}