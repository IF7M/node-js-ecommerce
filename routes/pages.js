const express = require('express');
const router = express.Router();
const Ads = require('../models/ads');
const Product = require('../models/product');
const Page = require('../models/page');


router.get('/', (req, res) => {

    Ads.find((err, ads) => {
        Product.find((err, Product) => {
            if (!err) {
                res.render('pages/home', {
                    ads: ads,
                    Product: Product
                })
            }

        })
    })
});





// all pages
router.get('/:slug', (req, res) => {

    let slug = req.params.slug;
    
    Page.findOne({slug:slug},(err, page) => {
        if (!err) {
            
            res.render('pages/index-page', {
                title: page.title,
                content: page.content
            });
        } else {
            console.log(err);
            res.render('pages/404');
        }

    })

});






router.get('/login', (req, res) => {


    res.render('pages/login')
})


//Exports
module.exports = router;