import express from 'express'
const router = express.Router()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../model/User.js"

const SALT = Number(process.env.SALT)
const JWT_KEY = process.env.JWT_KEY

router.post('/register', async (req, res)=>{
    try{
        const { username, email, password, address: { province, town, streetAddress, postalCode } } = req.body;
        const newUser = new User({
            username,
            email,
            password:bcrypt.hashSync(password, SALT),
            address: {
                province,
                town,
                streetAddress,
                postalCode,
            },
        })
        await newUser.save()
        res.send(`new user ${req.body.username} created`)
    } catch (err){
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login request received:", { username, password });

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Unknown username");
            return res.status(401).json({ message: "Unknown username" });
        }

        // Verify password
        const verified = await bcrypt.compare(password, user.password);
        console.log("Password verification result:", verified);

        if (!verified) {
            console.log("Incorrect password");
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Sign token
        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: 60 * 60 * 24,
        });
        console.log("Token generated:", token);

        // Send response
        return res.json({ message: "user verified", token, user });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).send({ message: "Internal server error" });
    }
});


export default router