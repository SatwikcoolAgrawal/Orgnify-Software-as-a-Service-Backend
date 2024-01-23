const express = require('express');
const { CartItem, Subscription, Order } = require('../models');
const JwtDecoder = require('../middleware');
const moment = require('moment');

/**
 * Express Router for handling user-related actions such as placing orders and managing subscriptions.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * Handles the order success endpoint, where users can place orders.
 * @async
 * @function
 * @name postOrderSuccess
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
router.post('/order-success', JwtDecoder, async (req, res) => {
  let success = false;
  try {
    const user = req.user;

    // Fetch cart items for the user
    const cartList = await CartItem.find({ user: user.id });
    await CartItem.deleteMany({ user: user.id });

    if (cartList.length === 0) return res.status(200).json({ message: "Cart is empty" });

    // Create a new order for the user
    const order = new Order({
      user: user.id,
      orderDate: moment(),
    });

    const newOrder = await order.save();

    // Create subscriptions for each cart item
    // Use Promise.all to parallelize subscription creation
    await Promise.all(cartList.map(async (obj) => {
      const subs = new Subscription({
        user: user.id,
        plan: obj.plan,
        startDate: moment(),
        expiryDate: moment().add(1, obj.duration),
        status: "active",
        order: newOrder,
      });

      return subs.save();
    }));

    success = true;
    res.status(200).json({ success, message: "Order Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message, success });
  }
});

/**
 * Retrieves the user's orders.
 * @async
 * @function
 * @name getOrders
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
router.get('/get-orders', JwtDecoder, async (req, res) => {
  let success = false;
  try {
    const user = req.user;

    const userOrders = await Order.find({ user: user.id }).sort({ orderDate: -1 });

    success = true;
    return res.status(200).json({ success, data: userOrders });
  } catch (error) {
    return res.status(500).json({ success, message: error.message });
  }
});

/**
 * Retrieves user subscriptions, optionally filtered by status.
 * @async
 * @function
 * @name getSubscriptions
 * @param {object} req - Express request object.
 * @query {status}["active","expired"] to fetch particular subscriptions  
 * @param {object} res - Express response object.
 * @returns {Promise<void>}
 */
router.get('/subscriptions', JwtDecoder, async (req, res) => {
  try {
    const user = req.user;
   
    const { status } = req.query;
    let query = { user: user.id };

     //  /subscriptions?status={value}
    if (status) {
      query.status = status; // If status is provided in the query, filter by status
    }

    const subscriptions = await Subscription.find(query).populate('plan');
    res.json({data:subscriptions});
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
