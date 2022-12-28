const mongoose = require('mongoose');


const ProductSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug:{
        type: String
    },
    sdesc:{
        type: String
    }, 
    desc:{
        type: String
    },
    price:{
        type: Number,
        required: true
    },
    sprice:{
        type: Number
       
    },
    thumbImg:{
        type: String
    },
    gallery:{
        type: Array
    },
    category:{
        type: String
    },
    quantity:{
        type: Number,
        required: true,
        default: 0
    }
})

const Product = module.exports = mongoose.model('Product', ProductSchema);