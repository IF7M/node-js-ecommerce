const mongoose = require('mongoose');

//category schema 

const CategorySchema = mongoose.Schema({
    cname:{
        type: String,
        required: true
    },
    slug:{
        type: String
    },
    sorting:{
        type: Number
    }
});


const Category = module.exports = mongoose.model('Category', CategorySchema);