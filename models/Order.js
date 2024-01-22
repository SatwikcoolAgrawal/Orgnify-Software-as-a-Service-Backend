const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents the schema for an order.
 * @typedef {Object} OrdersSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user who placed the order.
 * @property {Array} items - An array of items in the order, each containing plan and duration details.
 * @property {mongoose.Schema.Types.ObjectId} items[].plan - The plan associated with the item.
 * @property {String} items[].duration - The duration of the plan, either "month" or "year".
 * @property {Date} orderDate - The date and time when the order was placed.
 */

// Define the 'Orders' schema
const ordersSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    }
});

// Create the 'Order' model based on the defined schema
const Order = mongoose.model("Order", ordersSchema);

// Export the 'Order' model for use in other modules
module.exports = Order;
