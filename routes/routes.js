const express = require('express');
const {User} = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
//Post Method
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

// login in
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
//Get all Method
router.get('/servicesAll', async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})



//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;