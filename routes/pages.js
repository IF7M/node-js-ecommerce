const express = require('express')
const router = express.Router()
const Ads = require('../models/ads');
const Product = require('../models/product');

router.get('/',(req,res)=>{
   
   Ads.find((err, ads)=>{
        Product.find((err, Product)=>{
            if(!err){
                res.render('pages/home',{
                    ads:ads,
                    Product:Product
                })
            }
          
        })
       
    
    
    
   })
    
})


router.get('/shop',(req,res)=>{
   
        Product.find((err, Product)=>{
            if(!err){
                res.render('pages/shop',{
                    Product:Product
                })
            }
          
        })
       
    
    
    
   
    
})


router.get('/login',(req,res)=>{
   

    res.render('pages/login')
})


//Exports
module.exports = router;