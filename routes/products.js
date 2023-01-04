const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const product = require('../models/product');

router.get('/', (req, res) => {

    Product.find((err, Product) => {
        if (!err) {
            res.render('pages/shop', {
                Product: Product
            })
        }

    })
});



// Product page
// router.get('/:Product', (req, res) => {

//     let Product = req.params.Product;
    
//     Page.findOne({slug:slug},(err, page) => {
//         if (!err) {
            
//             res.render('pages/index-page', {
//                 title: page.title,
//                 content: page.content
//             });
//         } else {
//             console.log(err);
//             res.render('pages/404');
//         }

//     })

// });

// category products 
router.get('/:category', (req, res) => {

  let categorySlug = req.params.category;

  Category.findOne({slug:categorySlug},(err, cat)=>{
   
        Product.find({category:categorySlug },(err, Product) => {
            if (!err) {
                res.render('pages/cat_products', {
                    title: cat.title,
                    Product: Product
                })
                console.log(product)
            } else {
                console.log(err);
                res.render('pages/404');
            }
    
        })

   
  })
    
  

});





router.get('/login', (req, res) => {


    res.render('pages/login')
})


//Exports
module.exports = router;