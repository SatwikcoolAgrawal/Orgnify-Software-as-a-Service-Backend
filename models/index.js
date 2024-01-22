/**
 * Module containing models for user-related entities, shopping cart, services, plans, and orders.
 * @module Models
 */

// Import necessary models
const User = require('./User'); // Import the User model
const CartItem = require('./Cart'); // Import the Cart model
const { Service, Plan } = require('./Service'); // Import the Service and Plan models
const Order = require('./Order'); // Import the Order model
const Subscription = require('./Subscription')
/**
 * Object containing references to various models for easy access in other modules.
 * @typedef {Object} ModelsObject
 * @property {Model<UserSchema>} User - The User model.
 * @property {Model<CartItemSchema>} CartItem - The Cart model.
 * @property {Model<ServiceSchema>} Service - The Service model.
 * @property {Model<OrderSchema>} Order - The Order model.
 * @property {Model<PlanSchema>} Plan - The Plan model.
 */

// Export the models for use in other modules
/**
 * @type {ModelsObject}
 */
module.exports = {
    User,    // Export the User model
    CartItem,    // Export the Cart model
    Service, // Export the Service model
    Order,   // Export the Order model
    Plan,
    Subscription    // Export the Plan model
};
