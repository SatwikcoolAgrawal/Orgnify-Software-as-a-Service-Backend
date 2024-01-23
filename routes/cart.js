const express = require('express');
const { User, CartItem, Service, Plan } = require('../models');
const router = express.Router();
const {authorizerMiddleware}  = require('../middleware');

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
 * @middleware {authorizerMiddleware} - Middleware to decode JWT token.
 * @returns {Promise<CartResponseBody>} - The response body containing the user's cart items.
 */
router.get('/cart', authorizerMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        // const user = await User.findOne({ email: userData.email });

        // Find user's cartItem
        let cart = await CartItem.find({ user: userData.id }).populate('plan');
        console.log('User Cart:', cart); // Debug statement

        // Respond with the cart items
        res.status(201).json({ data: cart });
    } catch (error) {
        console.error('Error in /cart:', error); // Debug statement
        res.status(400).json({ message: error.message });
    }
});

/**
 * API to empty user's cart.
 * @function
 * @name POST/cart-empty
 * @middleware {authorizerMiddleware} - Middleware to decode JWT token.
 * @returns {Promise<CartResponseBody>} - The response body indicating the success or failure of emptying the cart.
 */
router.post('/cart-empty', authorizerMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const resp= await CartItem.deleteMany({user:user.id})
        console.log(resp);
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
 * @middleware {authorizerMiddleware} - Middleware to decode JWT token.
 * @param {AddItemRequestBody} req.body - The request body containing the plan ID and duration to be added to the cart.
 * @returns {Promise<CartResponseBody>} - The response body indicating the success or failure of adding the item to the cart.
 */
router.post('/add-item', authorizerMiddleware, async (req, res) => {
    let success = false;
    try {
        const { planId, duration } = req.body;
        const user = req.user;
        const planToAdd = await Plan.findById(planId);

        // Find user's cart, populate items field
        let cart = await CartItem.find({ user: user.id }).populate('plan');
        console.log('User Cart before adding item:', cart); // Debug statement

       
        // Check if a plan of this service is already in the cart
        if (cart.some((obj) => String(obj.plan._id) == String(planToAdd._id))) {
            // If the same plan is already in the cart
            console.log('Service already exists in the cart:', planToAdd); // Debug statement
            return res.status(200).json({ message: 'Service already exists in the cart', success: false });   
        } 
        else if (cart.some((obj) => String(obj.plan.service) === String(planToAdd.service))) {
            console.log('Plan already in the cart:', planToAdd); // Debug statement
            return res.status(409).json({ message: "Plan of This Service already added", success });
        } else {
            const newItem= new CartItem({
                user:user.id,
                plan:planToAdd,
                duration:duration
            })
            const result = await newItem.save();
            success = true;
            console.log('User Cart after adding item:', result); // Debug statement
            res.status(200).json({ message: "Service Added Successfully", success });
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
 * @middleware {authorizerMiddleware} - Middleware to decode JWT token.
 * @param {string} req.params.id - The ID of the plan to be removed from the cart.
 * @returns {Promise<CartResponseBody>} - The response body indicating the success or failure of removing the item from the cart.
 */
router.delete('/remove-item/:id', authorizerMiddleware, async (req, res) => {
    let success = false;
    try {
        const itemId = req.params.id;
        // deleteing cartItem of user and requested plan
        let cart = await CartItem.findByIdAndDelete(itemId);
        success = true;
        console.log('User Cart after removing item:', cart); // Debug statement
        res.status(201).json({ message: "Removed Item", success });
    } catch (error) {
        console.error('Error in /remove-item:', error); // Debug statement
        res.status(500).json({ message: error.message });
    }
});

/**
 * @type {Router}
 */
module.exports = router;
