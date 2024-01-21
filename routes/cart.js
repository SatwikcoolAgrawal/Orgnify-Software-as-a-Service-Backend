const express = require('express');
const { User, Cart, Service, Plan } = require('../models');
const router = express.Router();
const JwtDecoder  = require('../middleware');

/**
 * Express router for handling user cart-related routes.
 * @typedef {import('express').Router} Router
 */

/**
 * Represents the response body for the cart-related endpoints.
 * @typedef {Object} CartResponseBody
 * @property {string} message - A message providing information about the operation.
 * @property {boolean} [success] - Indicates if the operation was successful.
 * @property {Array} [data] - Additional data related to the cart (e.g., cart items).
 */

/**
 * API to get user's cart.
 * @function
 * @name GET/cart
 * @middleware {JwtDecoder} - Middleware to decode JWT token.
 * @returns {Promise<CartResponseBody>} - The response body containing the user's cart items.
 */
router.get('/cart', JwtDecoder, async (req, res) => {
    try {
        const userData = req.user;
        const user = await User.findOne({ email: userData.email });

        // Find user's cart, populate items field
        let cart = await Cart.findOne({ user: user }).populate('items');
        console.log('User Cart:', cart); // Debug statement

        // If user doesn't have a cart, create a new one
        if (!cart) {
            const newCart = new Cart({ user: user });
            cart = await newCart.save();
        }

        // Respond with the cart items
        res.status(201).json({ data: cart.items });
    } catch (error) {
        console.error('Error in /cart:', error); // Debug statement
        res.status(400).json({ message: error.message });
    }
});

/**
 * API to empty user's cart.
 * @function
 * @name POST/cart-empty
 * @middleware {JwtDecoder} - Middleware to decode JWT token.
 * @returns {Promise<CartResponseBody>} - The response body indicating the success or failure of emptying the cart.
 */
router.post('/cart-empty', JwtDecoder, async (req, res) => {
    try {
        const user = req.user;

        // Update the user's cart to have an empty items array
        let cart = await Cart.findOneAndUpdate({ user: user.id }, { items: [] });
        console.log('Emptied Cart:', cart); // Debug statement

        res.status(201).json({ message: "Cart Emptied successfully", success: true });
    } catch (err) {
        console.error('Error in /cart-empty:', err); // Debug statement
        res.status(400).json({ message: err.message, success: false });
    }
});

/**
 * Represents the request body for adding an item to the user's cart.
 * @typedef {Object} AddItemRequestBody
 * @property {string} planId - The ID of the plan to be added to the cart.
 * @property {string} duration - The duration of the plan to be added.
 */

/**
 * API to add an item to user's cart.
 * @function
 * @name POST/add-item
 * @middleware {JwtDecoder} - Middleware to decode JWT token.
 * @param {AddItemRequestBody} req.body - The request body containing the plan ID and duration to be added to the cart.
 * @returns {Promise<CartResponseBody>} - The response body indicating the success or failure of adding the item to the cart.
 */
router.post('/add-item', JwtDecoder, async (req, res) => {
    let success = false;
    try {
        const { planId, duration } = req.body;
        const user = req.user;
        const planToAdd = await Plan.findById(planId);

        // Find user's cart, populate items field
        let cart = await Cart.findOne({ user: user.id }).populate('items.plan');
        console.log('User Cart before adding item:', cart); // Debug statement

        // If user doesn't have a cart, create a new one
        if (!cart) {
            const newCart = new Cart({ user: user });
            cart = await newCart.save();
        }

        let items = cart.items;

        // Check if a plan of this service is already in the cart
        if (items.some((obj) => obj.plan.service == planToAdd.service)) {
            console.log('Plan already in the cart:', planToAdd); // Debug statement
            return res.status(409).json({ message: "Plan of This Service already added", success });
        } else if (items.some((obj) => obj.plan._id != planToAdd._id)) {
            // Check if a different plan of the same service is already in the cart
            items.push({
                plan: planToAdd,
                duration: duration
            });
            cart.items = items;
            const result = await cart.save();
            success = true;
            console.log('User Cart after adding item:', result); // Debug statement
            res.status(200).json({ message: "Service Added Successfully", success });
        } else {
            // If the same plan is already in the cart
            console.log('Service already exists in the cart:', planToAdd); // Debug statement
            return res.status(200).json({ message: 'Service already exists in the cart', success: false });
        }
    } catch (error) {
        console.error('Error in /add-item:', error); // Debug statement
        res.status(500).json({ message: error.message });
    }
});

/**
 * API to remove an item from user's cart.
 * @function
 * @name DELETE/remove-item/:id
 * @middleware {JwtDecoder} - Middleware to decode JWT token.
 * @param {string} req.params.id - The ID of the plan to be removed from the cart.
 * @returns {Promise<CartResponseBody>} - The response body indicating the success or failure of removing the item from the cart.
 */
router.delete('/remove-item/:id', JwtDecoder, async (req, res) => {
    let success = false;
    try {
        const user = req.user;
        const planId = req.params.id;
        let cart = await Cart.findOne({ user: user.id });

        let items = cart.items;

        // Filter out the item to be removed
        items = items.filter((it) => String(it.plan) !== planId);

        // Update the cart with the modified items array
        cart.items = items;
        const result = await cart.save();
        success = true;
        console.log('User Cart after removing item:', result); // Debug statement
        res.status(201).json({ message: "Removed service", success });
    } catch (error) {
        console.error('Error in /remove-item:', error); // Debug statement
        res.status(500).json({ message: error.message });
    }
});

/**
 * @type {Router}
 */
module.exports = router;
