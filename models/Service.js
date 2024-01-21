const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents the schema for a service.
 * @typedef {Object} ServiceSchema
 * @property {String} name - The name of the service.
 * @property {String} type - The type of the service (e.g., 'database', 'utility', 'virtual machine').
 * @property {String} description - The description of the service.
 */

// Define the 'Service' schema
const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['database', 'utility', 'virtual machine'],
        default: 'utility',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

/**
 * Represents the schema for a plan associated with a service.
 * @typedef {Object} PlanSchema
 * @property {String} service - The name of the service associated with the plan.
 * @property {String} name - The name of the plan (e.g., 'basic', 'standard', 'pro').
 * @property {Number} price - The price of the plan.
 * @property {Array} features - An array of features included in the plan.
 */

// Define the 'Plan' schema
const planSchema = new Schema({
    // Reference the 'Service' schema based on the 'name' field
    service: {
        type: String,
        ref: 'Service',
        required: true,
    },
    name: {
        type: String,
        enum: ['basic', 'standard', 'pro'],
        default: 'basic',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
});

// Create a unique index on the 'service' field
planSchema.index({ service: 1 }, { unique: true });

// Create models based on the defined schemas
const Service = mongoose.model('Service', serviceSchema);
const Plan = mongoose.model('Plan', planSchema);

// Export the models for use in other modules
module.exports = { Service, Plan };