const express = require('express');
const router = express.Router();
const Ads = require('../models/ads');
const Product = require('../models/product');
const Page = require('../models/page');
const Category = require('../models/category');

router.get('/', (req, res) => {

    Ads.find((err, ads) => {
        Product.find((err, Product) => {
            Page.findOne({slug:'home'}, (err, page)=>{
                if (!err) {
                    res.render('pages/home', {
                        ads: ads,
                        Product: Product,
                        page1:page
                    })
                }
            })
               

           
          

        })
    })
});


router.get('/products', (req, res) => {

    Product.find((err, Product) => {
        if (!err) {
            res.render('pages/shop', {
                Product: Product
            })
        }

    })
});


// favicon fix 
router.get('/favicon.ico', (req,res)=>{
    res.send('F7M') 
   });

router.get('/cart',(req,res)=>{
    res.redirect('/cart/checkout')
});


// all pages
router.get('/:slug', (req, res) => {

    let slug = req.params.slug;
    
    Page.findOne({slug:slug}, (err, page) => {
        
        if (err) {
            console.log(err);
            res.redirect('/')

        } else {
            if(!page){
                res.render('pages/404');
            }else{
                 res.render('pages/index-page', {
                page:page

            });
            }
           
        }

    })

});






router.get('/login', (req, res) => {


    res.render('pages/login')
});




//Exports
module.exports = router;