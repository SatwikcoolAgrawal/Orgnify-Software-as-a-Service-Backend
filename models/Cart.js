const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique:true,
        require:true
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
