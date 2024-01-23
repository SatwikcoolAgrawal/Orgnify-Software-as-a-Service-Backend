// Import necessary modules and configure environment variables
require('dotenv').config();
const express = require('express');
const { Service, Plan } = require('../models');
const router = express.Router();


// Retrieve a list of distinct services for the Services Page
router.get('/services-all', async (req, res) => {
    try {
        const data = await Service.find();
        res.status(200).json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

})


// get details of a particular service
router.get('/service/:name', async (req, res) => {
    try {
        const service=req.params.name.toLowerCase();
        // Fetch all services from the database
        const servicesList = await Service.find({name:service});
        res.status(200).json({ data: servicesList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Retrieve all plans of a specific service
router.get('/plans/:service', async (req, res) => {
    const serviceName = req.params.service;
    try {
        const service=await Service.findOne({name:serviceName})
       
        // Find plans associated with the specified service
        const servicePlans = await Plan.find({ service: service._id}).populate('service');

        if (!servicePlans) {
            res.status(400).json({ message: "No Plans Found" });
        } else {
            res.status(200).json({ plans: servicePlans });
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

// Export the router for use in other modules
module.exports = router;
