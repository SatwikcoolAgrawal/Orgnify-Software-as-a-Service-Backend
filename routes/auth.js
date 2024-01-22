const express = require('express');
const { User } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Express router for handling user authentication-related routes.
 * @typedef {import('express').Router} Router
 */

/**
 * Represents the request body for the user registration endpoint.
 * @typedef {Object} RegisterRequestBody
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password for the user account.
 */

/**
 * Represents the response body for the user registration endpoint.
 * @typedef {Object} RegisterResponseBody
 * @property {boolean} success - Indicates if the registration was successful.
 * @property {string} [accessToken] - JWT token for authentication (if registration is successful).
 * @property {string} [message] - Additional message providing information about the registration process.
 */

/**
 * Handles user registration.
 * @function
 * @name POST/register
 * @param {RegisterRequestBody} req.body - The request body containing user registration data.
 * @returns {Promise<RegisterResponseBody>} - The response body indicating the success or failure of the registration.
 */
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

/**
 * Represents the request body for the user login endpoint.
 * @typedef {Object} LoginRequestBody
 * @property {string} email - The email address of the user.
 * @property {string} password - The password for the user account.
 */

/**
 * Represents the response body for the user login endpoint.
 * @typedef {Object} LoginResponseBody
 * @property {boolean} success - Indicates if the login was successful.
 * @property {string} [accessToken] - JWT token for authentication (if login is successful).
 * @property {string} [message] - Additional message providing information about the login process.
 */

/**
 * Handles user login.
 * @function
 * @name POST/login
 * @param {LoginRequestBody} req.body - The request body containing user login data.
 * @returns {Promise<LoginResponseBody>} - The response body indicating the success or failure of the login.
 */
router.post('/login', async (req, res) => {
    let success = false;

    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ 'email': email });

        if (!user) {
            return res.status(404).json({ success, message: "No user found" });
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

/**
 * @type {Router}
 */
module.exports = router;
