const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents the schema for a shopping cart.
 * @typedef {Object} CartItemSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the cart.
 * @property {mongoose.Schema.Types.ObjectId} plan - The plan associated with the item.
 * @property {String} duration - The duration of the plan, either "month" or "year".
 */

const cartItemSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
        required: true,
    },
    plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan', // Reference the 'Plan' model
    },
    duration: {
            type: String,
            enum: ["month", "year"],
    },
});

// Create a compound index on the 'user' and 'items.plan' fields to ensure uniqueness
cartItemSchema.index({ user: 1, plan: 1 }, { unique: true });

// Create the 'Cart' model based on the defined schema
const Cart = mongoose.model('CartItem', cartItemSchema);

// Export the 'Cart' model for use in other modules
module.exports = Cart;
