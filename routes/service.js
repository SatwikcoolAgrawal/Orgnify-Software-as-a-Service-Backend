// Import necessary modules and configure environment variables
require('dotenv').config();
const express = require('express');
const { Service, Plan } = require('../models');
const router = express.Router();

// Configure Stripe with the secret key from the environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Retrieve a list of distinct services for the homepage
router.get('/services', async (req, res) => {
    try {
        // Fetch all services from the database
        const servicesList = await Service.find();
        res.status(200).json({ services: servicesList });
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

// Retrieve all plans of a specific service
router.get('/plans/:service', async (req, res) => {
    const serviceName = req.params.service;
    try {
        // Find plans associated with the specified service
        const servicePlans = await Plan.find({ service: serviceName});

        if (!servicePlans) {
            res.status(400).json({ message: "No Plans Found" });
        } else {
            res.status(200).json({ plans: servicePlans });
        }
    } catch (error) {
        res.status(error.status).json({message:error.message});
    }
});

// Create a new service
router.post('/add-service', async (req, res) => {
    try {
        // Extract relevant data from the request body
        const { name, type, description } = req.body;

        // Check if a service with the same name already exists
        const existingServices = await Service.find({ name: name });

        if (existingServices.length > 0) {
            return res.status(409).json("Unable to create service, already exists");
        }

        // Create a new service instance
        const newService = new Service({
            name: name,
            description: description,
            type: type
        });

        // Save the new service to the database
        const savedService = await newService.save();

        res.status(200).json({message:"service created successfully"});
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
});

router.post('/add-plan',async (req,res)=>{
    try{
        const {service,name,price,features}=req.body;
        const existingPlan=await Plan.find({service:service,name:name});
        if (existingPlan.length > 0) {
            return res.status(409).json("Unable to create plan, already exists");
        }

        const newPlan=new Plan({
            service:service,
            name:name,
            price:price,
            features:features
        })

        const savedPlan=await newPlan.save();
        res.status(200).json({message:"service created successfully"});
    }
    catch(err){
        res.status(err.status).json({message:err.message})
    }
})

//  Update an existing plan of a service
router.post('/update-plan',async (req,res)=>{
    try{
        const {service,name,price,features}=req.body;
        const existingPlan=await Plan.findOneAndUpdate({service:service,name:name},{service:service,name:name,price:price,features:features});
        if (existingPlan.length == 0) {
            return res.status(404).json("Plan Not Found");
        }

        const newPlan=new Plan({
            service:service,
            name:name,
            price:price,
            features:features
        })

        const savedPlan=await newPlan.save();
        res.status(200).json({message:"service created successfully"});
    }
    catch(err){
        res.status(err.status).json({message:err.message})
    }
})

// Update an existing service by ID
router.patch('/update-service/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { type, description, name } = req.body;

        // Find and update the service with the provided ID
        const updatedService = await Service.findByIdAndUpdate(
            serviceId, { name:name, description:description, type:type }
        );

        if (!updatedService) {
            return res.status(500).json({ message: 'Update not done' });
        }
        res.status(200).json({message:"successfully updated"});
    } catch (error) {
        res.status(err.status).json({ message: error.message });
    }
});



// Delete a service by ID

router.delete('/delete-plan/:id', async (req, res) => {
    try {
        const planId = req.params.id;

        // Find and delete the service with the provided ID
        const deletedPlan = await Plan.findByIdAndDelete(planId).populate();
        res.send(`Plan with ${deletedPlan.name}-${deletedPlan.service.name} has been deleted.`);
    } catch (error) {
        res.status(err.status).json({ message: error.message });
    }
});


// Delete a service by ID

router.delete('/delete-service/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Find and delete the service with the provided ID
        const deletedService = await Service.findByIdAndDelete(serviceId);
        res.send(`Document with ${deletedService.name} has been deleted.`);
    } catch (error) {
        res.status(err.status).json({ message: error.message });
    }
});

// Export the router for use in other modules
module.exports = router;
