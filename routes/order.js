const express = require('express');
const { CartItem,Subscription, Order } = require('../models');
const router = express.Router();
const JwtDecoder  = require('../middleware');
const moment=require('moment');

router.post('/order-success',JwtDecoder, async (req,res)=>{
    let success=false;
    try {
        const user=req.user;
        console.log(user);
        const cartList= await CartItem.find({user:user.id});
        await CartItem.deleteMany({user:user.id});
        console.log('cart :',cartList)
        const order = new Order({
            user:user.id,
            orderDate:moment(),
        })
        console.log("order",order);
        const newOrder= await order.save();
        console.log("newOrder",newOrder);
        cartList.forEach(async (obj)=>{
            let subs= new Subscription({
                user:user.id,
                plan:obj.plan,
                startDate:moment(),
                expiryDate:moment().add(1,obj.duration),
                status:"active",
                order:newOrder
            })
            let result=await subs.save();
        })
        success=true;
        res.status(200).json({success,message:"Ordered Successful"});
    } catch (error) {
        res.status(500).json({message:error,success});
    }
})


module.exports=router;