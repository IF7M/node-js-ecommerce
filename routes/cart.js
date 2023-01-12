const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Page = require('../models/page');
const Category = require('../models/category');




// get add to cart

router.get('/add/:product', (req, res) => {

   let slug = req.params.product;
   

        Product.findOne({slug:slug},(err, p) => {
            
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
                        id:p.id,
                        slug:p.slug,
                        subtotal:p.sprice?p.sprice:p.price
                    })
                } else{
                    let cart = req.session.cart;
                    
                    let newItem = true;
                    for(let i = 0 ; i < cart.length; i++){
                        if(cart[i].slug == slug){
                            cart[i].qty++;
                            cart[i].subtotal = cart[i].price * cart[i].qty;
                            newItem = false;
                            break;
                        }
                        if(newItem){
                            cart.push({
                                name:p.name,
                                qty: 1,
                                price: p.sprice? parseFloat(p.sprice).toFixed(2):parseFloat(p.price).toFixed(2),
                                thumbImg:p.thumbImg,
                                id:p.id,
                                slug:p.slug,
                                subtotal:p.sprice?p.sprice:p.price
                            })
                        }
                    }
                
                }
            }
           
            res.redirect('back');
        })
    
});


// update cart 

router.get('/update/:product', (req, res)=>{
    let slug = req.params.product;
    let cart = req.session.cart;
    let action = req.query.action;
    
    for(let i = 0; i < cart.length; i++){
        if (cart[i].slug == slug){
            switch(action) {
                case 'add':
                    cart[i].qty++;
                    cart[i].subtotal = cart[i].price * cart[i].qty;
                    break;
                case 'remove':
                    cart[i].qty--;
                    
                    if(cart[i].qty > 0){
                        cart[i].subtotal = cart[i].price * cart[i].qty;
                    }else{
                        cart.splice(i, 1);
                        if (cart.length == 0){
                            delete req.session.cart;
                        }
                        
                    } 
                    break;
                case 'clear':
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default: 
                console.log('update issue!!');
                break;
            }
            break;
        }
    }
    res.redirect('back');

})

// clear cart 

router.get('/clear', (req, res)=>{
    delete req.session.cart;
    res.redirect('back');
});


router.get('/checkout', (req,res)=>{
    let cartTotal = 0;
if(req.session.cart){
    
    if(req.session.cart.length>1){
        req.session.cart.forEach(p =>{
            cartTotal = cartTotal + p.subtotal;
         });
    }else{
       
        cartTotal =req.session.cart[0].subtotal !== 0?req.session.cart[0].subtotal:0 ;
    }
   
}


res.render('pages/checkout',{
    cart: req.session.cart,
    cartTotal:cartTotal
})

})




//Exports
module.exports = router;