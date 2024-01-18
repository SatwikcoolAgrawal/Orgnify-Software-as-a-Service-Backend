const mongoose=require('mongoose');
const Schema=mongoose.Schema;
// const {Plan}=require('./Service')


const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Plan',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
});