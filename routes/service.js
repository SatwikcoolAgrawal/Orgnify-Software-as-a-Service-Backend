const express = require('express');
const { Service } = require('../models');
const { raw } = require('body-parser');
const router = express.Router();


// homepage service list  (distinct)

router.get('/services', async (req, res) => {
    try {
        const data = await Service.distinct('servicename');

        if (!data) {
            return res.status(500).json({ message: 'Error in connection in DB' })
            
        }

        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message })

    }

})


// get all plans of a service
router.get('/plans/:name',async (req,res)=>{
    let success=false;
    const name=req.params.name;
    try{
        const plans=await Service.find({servicename:name},"servicename plan description price");

        if (!plans){
            res.status(400).json({message:"No Service Found"});
        }
        else{
            res.status(201).json({data:plans});
        }
    } catch(error){
        res.status(500).json(error);
    }
})

//  addservice method
router.post('/addservice', async (req, res) => {
    const { serviceName, plans } = req.body;

    const service = new Service({
        productId: req.body.productId,
        servicename: req.body.servicename,
        description: req.body.description,
        plan: req.body.plan,
        price: req.body.price,
        priceId: req.body.priceId,
        duration: req.body.duration,
    });

    try {
        const serviceToSave = await service.save();

        res.status(200).json(serviceToSave);

    }
    catch (err) {
        res.status(500).json({ message: err.message });

    }


})

// update service

router.patch('/updateService/:id', async (req, res) => {
    try {
        const id = req.params.id;


        const { productId, serviceName, description, plan, price, duration } = req.body;

        const result = await User.findByIdAndUpdate(
            id, { productId, serviceName, description, plan, price, duration }
        );
        console.log(result);
        if (!result) {
            return res.status(500).json({ message: 'update not done' })

        }
        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//delete Service

//Delete by ID Method
router.delete('/deleteService/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Service.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;