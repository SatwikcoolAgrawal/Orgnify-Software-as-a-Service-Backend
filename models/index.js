// Import necessary models
const User = require('./User'); // Import the User model
const Cart = require('./Cart'); // Import the Cart model
const { Service, Plan } = require('./Service'); // Import the Service and Plan models
const Order = require('./Order'); // Import the Order model

// Export the models for use in other modules
module.exports = {
    User,    // Export the User model
    Cart,    // Export the Cart model
    Service, // Export the Service model
    Order,   // Export the Order model
    Plan     // Export the Plan model
};