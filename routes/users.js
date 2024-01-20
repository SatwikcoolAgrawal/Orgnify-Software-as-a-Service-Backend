const express = require('express');
const { User } = require('../models');
const router = express.Router();
const { JwtDecoder } = require('../middleware');

// Get all users method
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID method
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

// Update user method
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

// Delete user by ID method
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

module.exports = router;
