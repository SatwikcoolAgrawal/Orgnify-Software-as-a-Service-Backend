require('dotenv').config();
const express = require("express");
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.post('/create-customer', async(req, res) => {
    try{
        const customer = await stripe.customers.create({
            email: req.body.email,
            name: req.body.name,
        })
        console.log(customer)
        if(!customer){
            res.status(500).json({message: "Customer not created"})
        }
        else{
            res.status(200).json({message: "Customer object created"})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/create-subscriptions', async(req, res)=>{
    const customerId = req.body.customerId;
    const priceId = req.body.priceId;
    // console.log(customerId)
    try{
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }], 
            payment_behavior: 'default_incomplete',
            payment_settings: {save_default_payment_method: 'on_subscription'},
            expand: ['latest_invoice.payment_intent'],
        });

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    }
    catch(error){
        return res.status(400).send({error: {message: error.message}});
    }
})

module.exports = router;

