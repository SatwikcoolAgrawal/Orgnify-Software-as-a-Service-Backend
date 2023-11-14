const express = require('express');
const { Service } = require('../models');
const router = express.Router();


// getAll Services method

router.get('/servicesAll', async (req, res) => {


    try {
        const data = await Service.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }



})

//  addservice method

router.post('/addservice', async (req, res) => {
    const { serviceName, plans } = req.body;

    const service = new Service({

        serviceName: req.body.serviceName,
        plans: req.body.plans


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


        const { serviceName, plans } = req.body;

        const result = await User.findByIdAndUpdate(
            id, { serviceName, plans }
        );
        console.log(result);
        if (!result) {
            res.status(500).json({ message: 'update not done' })

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