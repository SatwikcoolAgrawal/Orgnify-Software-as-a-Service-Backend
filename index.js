// Load environment variables from .env file
require('dotenv').config();

// Import required libraries
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

// Obtain the MongoDB connection string from the environment variables
const mongoString = process.env.DATABASE_URL2;

// Allow MongoDB to accept queries without strict mode
mongoose.set("strictQuery", false);

// Connect to the MongoDB database using the provided connection string
function connectToDatabase() {
    mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
    
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.error('MongoDB Connection Error:', error);
    });

    database.once('connected', () => {
        console.log('Database Connected');
    });
}

// Invoke the function to connect to the database
connectToDatabase();

// Set the port for the server to the provided value or default to 3000
const PORT = process.env.PORT || 3000;

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for the application
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Import route modules
const { userRoute, authRoute, paymentRoute, serviceRoute, adminRoute, cartRoute,orderRoute } = require('./routes');

// Define routes for the application
app.use('/', authRoute);
app.use('/api', userRoute);
app.use('/api', orderRoute);
app.use('/api', serviceRoute);
app.use('/api', adminRoute);
app.use('/api', cartRoute);

// Separate route for payment-related endpoints
app.use('/api/payment', paymentRoute);

// Default route returning a success message
app.get('/', (req, res) => {
    res.send("Server started successfully");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
});
