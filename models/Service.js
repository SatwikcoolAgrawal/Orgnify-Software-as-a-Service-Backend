const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type:{
        type:String,
        enum:['database',"utility","virtual machine"],
        default:"utility",
        required:true
    },
    description: {
        type: String,
        required: true
    }
})

const planSchema= new Schema({
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required:true,
    },
    name:{
        type: String,
        enum:["basic","standard","pro"],
        default:"basic",
        required: true,
    },
    price:{
        type:  Number,
        required:true
    },
    features:{
        type : [String],
        default:[]
    }
})

planSchema.index({service:1,name:1},{unique:true})


const Service = mongoose.model('Service', serviceSchema);
const Plan = mongoose.model('Plan', planSchema);

module.exports = {Service,Plan};
