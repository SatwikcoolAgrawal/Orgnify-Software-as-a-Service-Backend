const express = require('express');
const { User, Service, CartItem, Order } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');

//Get all Method
router.get('/user-all', async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// getAll Services method

router.get('/services-all', async (req, res) => {
    try {
        const data = await Service.find();
        res.status(200).json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }

})


router.get('/user-cart/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await CartItem.find({ user: id }).populate('plan');
        res.status(200).json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/orders-all',async (req,res)=>{
    try {
        const data= await Order.find().sort({orderDate:-1});
        res.status(200).json({data});
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/order-per-date', async (req, res) => {
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
  
// router.get('/user-subscriptions',async (req,res)=>{
//     const 
// })

module.exports = router;
