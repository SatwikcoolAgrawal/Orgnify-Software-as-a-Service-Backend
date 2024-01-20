const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the 'Cart' schema
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
