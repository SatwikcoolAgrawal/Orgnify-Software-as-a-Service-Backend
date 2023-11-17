const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Services = new Schema({
    productId:{
        type:String,
        required:true
    },
    servicename: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    plan:{
        type: String,
        enum: ["Basic","Standard","Plus"] 
    },
    price: {
        type: Number,
        required: true
    },
    priceId:{
        type : String,
    },
    duration: {
        type: String,
        enum:["monthly"],
        required: true
    }
})


const Service = mongoose.model('Service', Services);

module.exports = Service;
