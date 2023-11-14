const express = require('express');
const {User} = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');


//Register Method
router.post('/register', async (req, res) => {
    
    const data = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isadmin,
        isSuperAdmin: req.body.issuperadmin,
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Login Method
router.post('/login', async (req, res) => {
    try {
        const { email,password } = req.body;
        console.log(`email ${email} + password : ${password}`);

        const user = await User.findOne({ 'email':email });

        if (!user) {
            res.status(400).json({ message: "no user find" });

        }
        const comp= await bcrypt.compare(password,user.password);
        if (comp) {

            res.status(201).json({ message: "logged In" });
        }
        else {
            res.status(400).json({ message: "invalid credentials" });
        }

    }
    catch (e) {
        res.status(400).json({ message: e.message });

    }

})

module.exports = router;