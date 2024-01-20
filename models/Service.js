// Import necessary modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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