const express = require('express');
const { User, Service, Cart } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');

//Get all Method
router.get('/user-all', async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json({data:data})
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// getAll Services method

router.get('/services-all', async (req, res) => {

    try {
        const data = await Service.find();
        res.status(200).json({data:data})
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

})


router.get('/cart-all', async (req, res) => {
    try {
        const data = await Cart.find().populate('user');
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/user-cart/:id',async (req,res)=>{
    const id=req.params.id;
    try {
        const data= await Cart.findOne({user:id}).populate('user').populate('items.plan');
        res.status(200).json({data:data})
    }
    catch(error){
        res.status(500).json({ message: error.message })
    }
})

// router.get('/user-subscriptions',async (req,res)=>{
//     const 
// })

module.exports = router;
