require('dotenv').config();
const express = require('express');
const { Service } = require('../models');
const { raw } = require('body-parser');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// homepage service list  (distinct)

router.get('/services', async (req, res) => {
    try {
        const data = await Service.distinct('servicename');

        console.log(data);

        if (!data) {
            return res.status(500).json({ message: 'Error in connection in DB' })
            
        }

        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message })

    }

})


// get all plans of a service
router.get('/plans/:name',async (req,res)=>{
    let success=false;
    const name=req.params.name;
    try{
        const plans=await Service.find({servicename:name},"servicename plan description price");

        if (!plans){
            res.status(400).json({message:"No Service Found"});
        }
        else{
            res.status(201).json({data:plans});
        }
    } catch(error){
        res.status(500).json(error);
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


        const { productId, servicename, description, plan, price, priceId, duration } = req.body;

        const productUpdate = await stripe.products.update(
            productId,
            {
                name: servicename,
                description : description,
            }
        );
        
        if(!productUpdate){
            return res.status(500).json({message : "Stripe product updation error"})
        }

        // const priceUpdate = await stripe.prices.update(
        //     priceId,
        //     {
        //         unit_amount: Number(price),
        //         recurring: {
        //             interval: 'month',
        //             interval_count: Number(duration)
        //         },  
        //     }
        // );

        // if(!priceUpdate){
        //     return res.status(500).json({message : "Stripe price updation error"})
        // }

        const result = await Service.findByIdAndUpdate(
            id, { productId, servicename, description, plan, price, priceId, duration }
        );
        console.log(result);
        if (!result) {
            return res.status(500).json({ message: 'update not done' })

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