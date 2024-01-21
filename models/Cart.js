const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents the schema for a shopping cart.
 * @typedef {Object} CartSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the cart.
 * @property {Array} items - An array of items in the cart, each containing plan and duration details.
 * @property {mongoose.Schema.Types.ObjectId} items[].plan - The plan associated with the item.
 * @property {String} items[].duration - The duration of the plan, either "month" or "year".
 */

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
        unique: true,
        required: true,
    },
    items: [{
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan', // Reference the 'Plan' model
        },
        duration: {
            type: String,
            enum: ["month", "year"],
        },
    }],
});

// Create a compound index on the 'user' and 'items.plan' fields to ensure uniqueness
cartSchema.index({ user: 1, 'items.plan': 1 }, { unique: true });

// Create the 'Cart' model based on the defined schema
const Cart = mongoose.model('Cart', cartSchema);

// Export the 'Cart' model for use in other modules
module.exports = Cart;
