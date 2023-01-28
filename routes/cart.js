const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Page = require('../models/page');
const Category = require('../models/category');
const Order = require('../models/Order');
const paypal = require('paypal-rest-sdk');
const session = require('express-session');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_SECRET
  });

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

router.get('/',(req,res)=>{
   
    res.redirect('/cart/checkout')
});

router.get('/checkout', (req,res)=>{
    let paypalClientId = process.env.PAYPAL_CLIENT_ID;
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
    cartTotal:cartTotal,
    paypalClientId:paypalClientId
})

})

// paypal post 

router.post('/create-order', (req, res)=>{
    const cart = req.session.cart;
    const cartTotal = (req.body.cartTotal/3.75).toFixed(2)
    console.log(cartTotal)
    const cartList = [];
    cart.forEach(item =>{
        cartList.push({
            "name": item.name,
            "sku": item.id,
            "price": (item.price/3.75).toFixed(2),
            "currency": "USD",
            "quantity": item.qty
        })

        
    }) 

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal",
            "payer_info":{
                "first_name":req.body.firstName,
                "last_name":req.body.lastName,
                "email":req.body.email
            }
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000/cart/success",
            "cancel_url": "http://localhost:4000/cart/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": cartList
            },
            "amount": {
                "currency": "USD",
                "total": cartTotal
            }
        }]
    };
    router.get('/success', (req, res) => {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
    //   console.log(1,'someThing')
    Order.find({}, (err,orders)=>{
        if(!err){
            let newOrder = new Order({
                cid:payerId,
                orderN:(orders.length+1),
                total:cartTotal,
                cart:cartList,
                paymentid:paymentId

            })

            newOrder.save(async (err)=>{
                if(err){
                    console.log(err)
                } else {
                    return newOrder;
                }
                    
               
            });
        }
    })
      const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": cartTotal
            }
        }]
      };
    
      paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            
            const info = JSON.stringify(payment);
            const cid = execute_payment_json.payer_id;
            // console.log(2, 'someThing');
            delete req.session.cart;
            Order.find({cid:cid},  (err, order)=>{
               
         
                res.render('pages/thanku',{
                    total:order[order.length-1].total,
                    orderN:order[order.length-1].orderN,
                    cart:order[order.length-1].cart
                   });
            })
            
           
        }
    });
    });
      paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              throw error;
          } else {
              for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                  res.redirect(payment.links[i].href);
                }
              }
          }
        });
        

})


router.get('/cancel', (req, res) =>{
    res.redirect('/')
});



//Exports
module.exports = router;