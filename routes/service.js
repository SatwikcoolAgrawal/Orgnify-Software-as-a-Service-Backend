require('dotenv').config();
const express = require('express');
const { Service } = require('../models');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// homepage service list  (distinct)

router.get('/service', async (req, res) => {
    try {
        const data = await Service.distinct('servicename');

        console.log(data);

        if (!data) {
            res.status(500).json({ message: 'Error in connection in DB' })
        }

        res.json(data);

    }
    catch (error) {

        res.status(500).json({ message: error.message })

    }


})

//  addservice method

router.post('/addservice', async (req, res) => {
    const { serviceName, plans } = req.body;

    const product = await stripe.products.create({
        name: req.body.servicename,
        description: req.body.description
    });

    if(!product){
        return res.status(500).json({message : "Stripe product creation error"})
    }

    const price = await stripe.prices.create({
        unit_amount: Number(req.body.price),
        currency: 'usd',
        recurring: {
            interval: 'month',
            interval_count: Number(req.body.duration)
        },
        product: product.id,
    });

    if(!price){
        return res.status(500).json({message : "Stripe price creation error"})
    }

    const service = new Service({

        productId: product.id,
        servicename: req.body.servicename,
        description: req.body.description,
        plan: req.body.plan,
        price: req.body.price,
        priceId: price.id,
        duration: req.body.duration,

    });

    try {

        const serviceToSave = await service.save();

        res.status(200).json(serviceToSave);

    }
    catch (err) {
        res.status(500).json({ message: err.message });

    }


})

// update service

router.patch('/updateService/:id', async (req, res) => {
    try {
        const id = req.params.id;


        const { productId, serviceName, description, plan, price, duration } = req.body;

        const result = await User.findByIdAndUpdate(
            id, { productId, serviceName, description, plan, price, duration }
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

//delete Service

//Delete by ID Method
router.delete('/deleteService/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Service.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;