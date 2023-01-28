const mongoose = require('mongoose');


const OrderSchema =  mongoose.Schema({
    cid: {
        type: String,
        required: true
    },
    orderN:{
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    cart:[],
    paymentid:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Order = module.exports = mongoose.model('Order', OrderSchema);