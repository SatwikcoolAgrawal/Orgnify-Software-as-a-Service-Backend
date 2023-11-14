const express = require('express');
const { User } = require('../models');
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



//Get by User ID Method
router.get('/user/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id);

        if (!data) {

            res.status(500).json({ message: "no such user exist" });

        }

        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update user
router.patch('/updateUser/:id', async (req, res) => {
    try {
        const id = req.params.id;


        const { name, email, password } = req.body;
        const options = { new: true };
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.findByIdAndUpdate(
            id, { name, email, password: hashedPassword }
        );
        console.log(result);
        if (!result) {
            res.status(500).json({ message: 'update not done' })

        }
        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;