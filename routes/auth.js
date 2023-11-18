require('dotenv').config({ path: '../' });
const express = require('express');
const { User } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Register Method
router.post('/register', async (req, res) => {

    const data = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isadmin,
        isSuperAdmin: req.body.issuperadmin,
    })

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ success, error: 'Account already exist, try logging in!' });
    }

    try {
        const user = await data.save();
        const payload = {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin
        }
        const secret = process.env.SECRET;
        const jwtToken = jwt.sign(payload, secret);
        success = true

        res.status(200).json({ success, jwtToken })

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message })
    }
})

// Login Method
router.post('/login', async (req, res) => {
    let success = false
    try {
        const { email, password } = req.body;
        console.log(`email ${email} + password : ${password}`);

        const user = await User.findOne({ 'email': email });

        if (!user) {
            return res.status(400).json({ success, message: "no user find" });

        }
        const comp = await bcrypt.compare(password, user.password);
        if (comp) {
            const payload = {
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin
            }
            const secret = process.env.SECRET;
            const AccessToken = jwt.sign(payload, secret);
            success = true
            res.status(201).json({ message: "logged In", AccessToken, success });
        }
        else {
            res.status(400).json({ success, message: "invalid credentials" });
        }
    }
    catch (e) {
        res.status(400).json({ success, message: e.message });

    }

})

module.exports = router;