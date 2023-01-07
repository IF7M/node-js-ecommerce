const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');

/// static files
router.use(express.static(__dirname));
router.use(express.static('public'));

router.get('/', (req, res) => {

    Product.find((err, Product) => {
        if (!err) {
            res.render('pages/shop', {
                Product: Product
            })
        }

    })
});





// category products 
router.get('/:category', (req, res) => {

  let categorySlug = req.params.category;

  Category.findOne({slug:categorySlug},(err, cat)=>{
   if(cat){
    Product.find({category:categorySlug },(err, Product) => {
        if (!err) {
            res.render('pages/cat_products', {
                cat: cat,
                Product: Product
            })
        
        } else {
            console.log(err);
            res.render('pages/404');
        }

    })
   } else {
    console.log(err);
    res.render('pages/404');
}
        

   
  })
    
  

});


// category products 
router.get('/:category/:product', (req, res) => {

      Product.findOne({slug:req.params.product}, (err, p) => {
          if (!p) {
              console.log(err);
              res.render('pages/404');
          
          } else {
           console.log(p)
           res.render('pages/s_product', {
                pname: p.name,
                pslug: p.slug,
                psdesc: p.sdesc,
                pdesc: p.desc,
                pcategory: p.category,
                pprice: p.price,
                psprice: p.sprice,
                pquantity: p.quantity,
                pthumbImg: p.thumbImg,
                pgallery: p.gallery,
                pid: p._id
            })

          }
  
      })
 

    });





//Exports
module.exports = router;