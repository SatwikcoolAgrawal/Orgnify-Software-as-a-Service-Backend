const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents the schema for a user subscription.
 * @typedef {Object} SubscriptionSchema
 * @property {mongoose.Schema.Types.ObjectId} user - The user associated with the subscription.
 * @property {mongoose.Schema.Types.ObjectId} plan - The plan associated with the subscription.
 * @property {Date} startDate - The start date of the subscription.
 * @property {Date} expiryDate - The expiry date of the subscription.
 * @property {String} status - The status of the subscription (e.g., 'active', 'expired').
 */

// Define the 'Subscription' schema
const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index:true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
        index:true,
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true,
        index:true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        required: true,
        default: "expired",
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        require:true
    }
});

// Create the 'Subscription' model based on the defined schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Export the 'Subscription' model for use in other modules
module.exports = Subscription;
