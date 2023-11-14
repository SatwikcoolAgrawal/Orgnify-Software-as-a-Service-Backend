const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Services = new Schema({
    service: {
        type: String,
        required: true

    },
    price: {
        type: String,
        required: true
    }
    ,
    duration: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})




Services.pre('save', async function (next) {



});




const Service = mongoose.model('Service', Services);

module.exports = Service;
