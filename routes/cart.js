const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Page = require('../models/page');
const Category = require('../models/category');




// get add to cart

router.post('/add/:product', (req, res) => {

   let id = req.params.product;

        Product.findById(id,(err, p) => {
            if (err) {
                console.log(err)
            }else{
                if(typeof req.session.cart == "undefined"){
                    req.session.cart = [];
                    req.session.cart.push({
                        name:p.name,
                        qty: 1,
                        price: p.sprice? parseFloat(p.sprice).toFixed(2):parseFloat(p.price).toFixed(2),
                        thumbImg:p.thumbImg,
                        id:id
                    })
                } else{
                    let cart = req.session.cart;
                    // let newItem = true;

                    for(let i = 0 ; i < cart.length; i++){
                        if(cart[i].id === id){
                            cart.qty = +1;
                            newItem = false;
                            break;
                        }else{
                            cart.push({
                                name:p.name,
                                qty: 1,
                                price: p.sprice? parseFloat(p.sprice).toFixed(2):parseFloat(p.price).toFixed(2),
                                thumbImg:p.thumbImg,
                                id:id
                            })
                        }
                    }
                
                }
            }
            console.log(req.session.cart);
            res.redirect('back');
        })
    
});


//Exports
module.exports = router;