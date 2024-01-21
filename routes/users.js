const express = require('express');
const { User } = require('../models');
const router = express.Router();
const JwtDecoder = require('../middleware');

/**
 * Express router for handling user-related routes.
 * @typedef {import('express').Router} Router
 */

/**
 * Represents the response body for the user-related endpoints.
 * @typedef {Object} UserResponseBody
 * @property {Array} [users] - The array of users retrieved from the database.
 * @property {Object} [user] - The user retrieved from the database.
 * @property {string} [message] - A message providing information about the operation.
 */

/**
 * API to get all users.
 * @function
 * @name GET/users
 * @returns {Promise<UserResponseBody>} - The response body containing the array of users.
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * API to get user by ID.
 * @function
 * @name GET/user
 * @middleware {JwtDecoder} - Middleware to decode JWT token.
 * @returns {Promise<UserResponseBody>} - The response body containing the user information.
 */
router.get('/user', JwtDecoder, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Represents the request body for updating a user.
 * @typedef {Object} UpdateUserRequestBody
 * @property {string} name - The updated name of the user.
 * @property {string} email - The updated email of the user.
 * @property {string} password - The updated password of the user.
 * @property {string} role - The updated role of the user.
 */

/**
 * API to update a user.
 * @function
 * @name POST/update-user
 * @middleware {JwtDecoder} - Middleware to decode JWT token.
 * @param {UpdateUserRequestBody} req.body - The request body containing the updated user information.
 * @returns {Promise<UserResponseBody>} - The response body containing the updated user information.
 */
router.post('/update-user', JwtDecoder, async (req, res) => {
    try {
        const { id } = req.user;
        const { name, email, password, role } = req.body;

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should have a minimum length of 6" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, { name: name, email: email, password: password, role: role },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * API to delete a user by ID.
 * @function
 * @name DELETE/delete-user/:id
 * @param {string} req.params.id - The ID of the user to be deleted.
 * @returns {Promise<UserResponseBody>} - The response body indicating the success or failure of the user deletion.
 */
router.delete('/delete-user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
        }

        res.send(`User with name ${deletedUser.name} has been deleted.`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @type {Router}
 */
module.exports = router;
