const mongoose = require('mongoose');

//Ads schema 

const AdsSchema = mongoose.Schema({
    title:{
        type: String
        
    },
    ad:{
        type: String,
        required: true
    },
    linkto:{
        type: String
    }
});


const Ads = module.exports = mongoose.model('Ads', AdsSchema);