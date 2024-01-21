// Importing routes from separate files
const authRoute = require("./auth");
const userRoute = require("./users");
const serviceRoute = require("./service");
const cartRoute = require("./cart");
const paymentRoute = require("./payment");
const adminRoute = require("./admin");

// Exporting the routes for use in the main application
module.exports = {
    authRoute,      // Authentication-related routes
    userRoute,      // User-related routes
    serviceRoute,   // Service-related routes
    cartRoute,      // Cart-related routes
    paymentRoute,   // Payment-related routes
    adminRoute      // Admin-related routes
};