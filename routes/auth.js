const express = require('express');
const { User } = require('../models');
const nodemailer=require('nodemailer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const hostname= process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
    },
});



async function sendVerificationEmail(userEmail, verificationToken) {
    try {
        // Create a verification link using the token
        const verificationLink = `${hostname}/verify?token=${verificationToken}`;

        // Prepare the email content with a styled button
        const mailOptions = {
            from: process.env.MAILER_EMAIL,
            to: userEmail,
            subject: 'Verify Your Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 16px;">Thank you for registering! Please click the button below to verify your account:</p>
                    <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Account</a>
                </div>
            `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log(`Verification email sent to ${userEmail}: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

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
        
        payload={
            id:user._id,
            email:user.email
        }

        const secret = process.env.JWT_SECRET;
        const verificationToken = jwt.sign(payload, secret);
        await sendVerificationEmail(user.email,verificationToken);
        success = true;
        res.status(201).json({ success,message:"User registered successfully, check you e-mail to verify." });

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

        if (!user.isVerified) return res.status(401).json({success,message: "User not verified. Please verify your account before logging in."})

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

router.get('/verify', async (req, res) => {
    try {
        const verificationToken = req.query.token;
        const payload=jwt.decode(verificationToken);
        // Find the user by the verification token
        const user = await User.findOneAndUpdate({ email:payload.email },{isVerified:true});

        if (!user) {
            // User not found or already verified
            return res.status(404).send('Invalid verification link.');
        }

        // Redirect or send a response as needed
        res.status(200).send('Account successfully verified. You can now log in.');
    } catch (error) {
        console.error('Error during verification:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * @type {Router}
 */
module.exports = router;
