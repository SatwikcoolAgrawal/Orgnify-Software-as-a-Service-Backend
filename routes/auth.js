require('dotenv').config({ path: '../' });
const express = require('express');
const { User } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Method
router.post('/register', async (req, res) => {
    let success = false;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ success: success, message: 'Account already exists, try logging in!' });
    }

    try {
        // Create a new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        // Save the user to the database
        const user = await newUser.save();

        // Generate JWT token for authentication
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        const secret = process.env.JWT_SECRET;
        const accessToken = jwt.sign(payload, secret, {
            expiresIn: '5h',
        });

        success = true;
        res.status(201).json({ success, accessToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login Method
router.post('/login', async (req, res) => {
    let success = false;

    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ 'email': email });

        if (!user) {
            return res.status(400).json({ success, message: "No user found" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Generate JWT token for authentication
            const payload = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
            const secret = process.env.JWT_SECRET;
            const accessToken = jwt.sign(payload, secret, {
                expiresIn: '5h',
            });

            success = true;
            res.status(200).json({ message: "Logged in", accessToken, success });
        } else {
            res.status(400).json({ success, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(400).json({ success, message: error.message });
    }
});

module.exports = router;
