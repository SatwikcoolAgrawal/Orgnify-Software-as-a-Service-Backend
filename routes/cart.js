const express = require('express');
const {User,Cart,Service} = require('../models');
const router = express.Router();
const JwtDecoder=require('../middleware')

router.get('/cart',JwtDecoder,async (req,res)=>{
    try{
        const data=req.user;
        const user=await User.findOne({email:data.email});
        let cart=await Cart.findOne({user:user}).populate('items');
        console.log(cart);
        if (!cart){
            const new_cart = new Cart({user:user});
            cart= await new_cart.save();
        }

        res.status(201).json({data:cart.items});
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
})

router.post('/additem',async (req,res)=>{
    let success=false;
    try{

        const data=req.user;
        const prod=req.body.id;
        const service= await Service.findOne({_id:prod});
        console.log(service);
        const user=await User.findOne({email:data.email});
        let cart=await Cart.findOne({user:user});
        console.log(cart);
        if (!cart){
            const new_cart = new Cart({user:user});
            cart= await new_cart.save();
        }

        if (cart.items.includes(service)){
            return res.status(400).json({message:"Service already added",success});
        }

        let items=cart.items;
        items.push(service);
        cart.items=items;
        const result=await cart.save();
        success=true
        res.status(200).json({message:"Service Added Successfully",success});
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
    
})

router.post ('/removeitem/:id',JwtDecoder,async (req,res)=>{
    try{
        const data=req.user;
        const prod=req.body.id;
        const service= await Service.findOne({_id:prod});
        console.log(service);
        const user=await User.findOne({email:data.email});
        let cart=await Cart.findOne({user:user});
        console.log(cart);
        if (!cart){
            const new_cart = new Cart({user:user});
            cart= await new_cart.save();
        }
        
        let items=cart.items;
        items.filter(service);
        cart.items=items;
    }
    catch(error){
        res.status(500).json(error);
    }
})

module.exports=router;