const express = require('express');
const { User, Service, CartItem, Order } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const {authorizerMiddleware,adminMiddleware}=require('../middleware');

//Get all Method
router.get('/user-all',[authorizerMiddleware,adminMiddleware], async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json({ users: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/user-cart/:id',[authorizerMiddleware,adminMiddleware], async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CartItem.find({ user: id }).populate('plan');
        res.status(200).json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/orders-all',[authorizerMiddleware,adminMiddleware],async (req,res)=>{
    try {
        const data= await Order.find().sort({orderDate:-1});
        res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/order-per-date',[authorizerMiddleware,adminMiddleware],async (req, res) => {
    try {
      
      // MongoDB aggregation pipeline to group orders by date and calculate count
      const result = await Order.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
            },
            count: { $sum: 1 },
          },
        },
      ]).sort({_id:1});
      const orderCounts = result.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
  
      res.status(200).json({ orderCounts, message: "Order counts by date fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Create a new service
router.post('/add-service',[authorizerMiddleware,adminMiddleware], async (req, res) => {
    let success=false
    try {
        // Extract relevant data from the request body
        let { name, type, description } = req.body;
        
        name=name.toLowerCase();
        // Check if a service with the same name already exists
        const existingServices = await Service.find({ name: name });

        if (existingServices.length > 0) {
            return res.status(409).json({success,message:"Unable to create service, already exists"});
        }

        // Create a new service instance
        const newService = new Service({
            name: name,
            description: description,
            type: type
        });

        // Save the new service to the database
        const savedService = await newService.save();
        success=true
        res.status(200).json({success,message:"service created successfully"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add-plan',[authorizerMiddleware,adminMiddleware],async (req,res)=>{
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
        res.status(200).json({message:`plan created successfully`});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

//  Update an existing plan of a service
router.post('/update-plan',[authorizerMiddleware,adminMiddleware],async (req,res)=>{
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
        res.status(500).json({message:err.message})
    }
})

// Update an existing service by ID
router.patch('/update-service/:id', [authorizerMiddleware,adminMiddleware],async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
});



// Delete a service by ID

router.delete('/delete-plan/:id',[authorizerMiddleware,adminMiddleware],async (req, res) => {
    try {
        const planId = req.params.id;

        // Find and delete the service with the provided ID
        const deletedPlan = await Plan.findByIdAndDelete(planId).populate();
        res.send(`Plan with ${deletedPlan.name}-${deletedPlan.service.name} has been deleted.`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete a service by ID

router.delete('/delete-service/:id',[authorizerMiddleware,adminMiddleware],async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Use Promise.all to perform parallel operations
        const [deletedService] = await Promise.all([
            Service.findByIdAndDelete(serviceId),
            Plan.deleteMany({ service: serviceId })
        ]);

        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.send(`Document with ${deletedService.name} has been deleted.`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
