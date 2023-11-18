const express = require('express');
const { User, Cart, Service } = require('../models');
const router = express.Router();
const {JwtDecoder} = require('../middleware')

router.get('/cart', JwtDecoder, async (req, res) => {
    try {
        const data = req.user;
        const user = await User.findOne({ email: data.email });
        let cart = await Cart.findOne({ user: user }).populate('items');
        console.log(cart);
        if (!cart) {
            const new_cart = new Cart({ user: user });
            cart = await new_cart.save();
        }

        res.status(201).json({ data: cart.items });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})


//api to delete a cart

router.post('/cartempty', JwtDecoder, async (req, res) => {

    try {
        console.log('api')
        const data = req.user;
        const user = await User.findOne({ email: data.email });
        let cart = await Cart.findOne({ user: user });
        cart.items = [];

        const resp = await cart.save();
        console.log('leaving ');
        res.status(201).json({ message: "Cart Emptied successfully", success: true })  
    }

    catch (err) {

        res.status(400).json({ message: err.message, success: false });

    }


})

router.post('/additem/:id', JwtDecoder, async (req, res) => {
    let success = false;
    try {

        const data = req.user;
        const prod = req.params.id;
        const service = await Service.findOne({ _id: prod });
        console.log(service);
        const user = await User.findOne({ email: data.email });
        let cart = await Cart.findOne({ user: user });
        console.log(cart);
        if (!cart) {
            const new_cart = new Cart({ user: user });
            cart = await new_cart.save();
        }

        if (cart.items.includes(service)) {
            return res.status(400).json({ message: "Service already added", success });
        }

        let items = cart.items;
        if (items.indexOf(prod) === -1) {
            items.push(service);
            cart.items = items;
            const result = await cart.save();
            success = true
            res.status(200).json({ message: "Service Added Successfully", success });
        }

        else return res.status(200).json({ message: 'Service already exist in card', success: false });

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }

})

router.delete('/removeitem/:id', JwtDecoder, async (req, res) => {
    let success = false;
    try {
        const data = req.user;
        const prod = req.params.id;
        const service = await Service.findOne({ _id: prod });
        const user = await User.findOne({ email: data.email });
        let cart = await Cart.findOne({ user: user });

        let items = cart.items;
        items = items.filter(it => it != prod);
        console.log(items);
        cart.items = items;
        const result = await cart.save();
        success = true;
        res.status(201).json({ message: "removed service", success })
    }
    catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;