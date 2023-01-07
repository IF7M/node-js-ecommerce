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





// all pages
router.get('/:slug', (req, res) => {

    let slug = req.params.slug;
    console.log(typeof(slug))
    Page.findOne({slug:slug}, (err, page) => {
        
        if (err) {
            console.log(err);
            res.render('pages/404');

        } else {
            res.render('pages/index-page', {
                page1:page

            });
        }

    })

});






router.get('/login', (req, res) => {


    res.render('pages/login')
})


//Exports
module.exports = router;