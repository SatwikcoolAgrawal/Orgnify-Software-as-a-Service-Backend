const express = require('express');
const { User, Service, Cart } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');

//Get all Method
router.get('/userAll', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// getAll Services method

router.get('/servicesAll', async (req, res) => {

    try {
        const data = await Service.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

})


router.get('/cartAll', async (req, res) => {
    try {
        const data = await Cart.find().populate('user');
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;
