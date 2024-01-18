const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const Orders=new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    items:[{
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
        },
        duration:{
            type:String,
            enum:["month","year"]
        }
    }],
    OrderDate:{
        type:Date,
        default:Date.now,
    } 
})


const Order=mongoose.model("Order",Orders);

module.exports=Order;