require('dotenv').config();
const express = require("express");
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// router.post('/create-customer', async (req, res) => {
//     try {
//         const customer = await stripe.customers.create({
//             email: req.body.email,
//             name: req.body.name,
//         })
//         // console.log(customer)
//         if (!customer) {
//             res.status(500).json({ message: "Customer not created" })
//         }
//         else {
//             res.status(200).json({ customerId: customer.id })
//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// router.post('/create-subscriptions', async (req, res) => {
//     const customerId = req.body.customerId;
//     const priceId = req.body.priceId;
//     console.log(priceId)

//     let priceArray = priceId.map(p => { return { price: p } });


//     console.log(priceArray);
//     try {
//         const subscription = await stripe.subscriptions.create({
//             customer: customerId,
//             items: priceArray
//             ,
//             payment_behavior: 'default_incomplete',
//             payment_settings: { save_default_payment_method: 'on_subscription' },
//             expand: ['latest_invoice.payment_intent'],
//         });

//         res.send({
//             subscriptionId: subscription.id,
//             clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//         });

//     }
//     catch (error) {
//         return res.status(400).send({ error: { message: error.message } });
//     }
// })


router.post("/create-payment-intent", async (req, res) => {
    const { total } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "INR",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });
  
// router.post('/cancel-subscription', async (req, res) => {
//     const deletedSubcription = await stripe.subscriptions.cancel(
//         req.body.subscriptionId
//     );
//     res.send(deletedSubcription);
// })

module.exports = router;

