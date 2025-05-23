import express from 'express'
const router = express.Router()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../model/User.js"
import tokenValidation from '../middlewares/tokenValidation.js'
import generateVerificationToken from '../middlewares/generateVerificationToken.js'

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

router.get("/:username", tokenValidation, async (req, res) => {
    try {
        const {username} = req.params;

        if (!username){
            return  res.status(400).json({ error: 'Usename not found in request' });
        }

        // Fetch user data
        const user = await User.findOne({username}).select("-password"); // Exclude the password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({user});
        console.log(`showing data of ${username}`)
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        const email = decoded.email;

        await User.updateOne({email}, {emailVerified: true});

        res.send("email verified successfully")
    }catch (error) {
        res.status(400).send("invalid or expired token");
    }
});

router.post("/auth/signup", async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
  
    try {
      const user = new User({ email, first_name, last_name, password });
      await user.save();
  
      const token = generateVerificationToken(email);
      await sendVerificationEmail(email, token);
  
      res.status(200).json({ message: "User registered. Verification email sent." });
    } catch (error) {
      res.status(500).json({ message: "Error creating user: " + error.message });
    }
  });
  



export default router