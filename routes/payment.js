const express = require("express");
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Express router for handling payment-related routes.
 * @typedef {import('express').Router} Router
 */

/**
 * Represents the request body for creating a payment intent.
 * @typedef {Object} CreatePaymentIntentRequestBody
 * @property {number} total - The total amount for the payment.
 */

/**
 * Represents the response body for creating a payment intent.
 * @typedef {Object} CreatePaymentIntentResponseBody
 * @property {string} clientSecret - The client secret for the PaymentIntent.
 */

/**
 * Creates a PaymentIntent for the given order amount.
 * @function
 * @name POST/create-payment-intent
 * @param {CreatePaymentIntentRequestBody} req.body - The request body containing the total amount for the payment.
 * @returns {Promise<CreatePaymentIntentResponseBody>} - The response body containing the client secret for the PaymentIntent.
 */
router.post("/create-payment-intent", async (req, res) => {
    const { total } = req.body;

    try {
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
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @type {Router}
 */
module.exports = router;
