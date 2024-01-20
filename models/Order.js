const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the 'Orders' schema
const ordersSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
        required: true,
    },
    items: [{
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            require:true // Reference the 'Plan' model
        },
        duration: {
            type: String,
            enum: ["month", "year"],
        },
    }],
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

// Create the 'Order' model based on the defined schema
const Order = mongoose.model("Order", ordersSchema);

// Export the 'Order' model for use in other modules
module.exports = Order;
