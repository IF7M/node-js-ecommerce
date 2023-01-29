const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/Order');




router.get('/', (req, res) => {

    Order.find((err, orders) => {
        res.render('admin/orders', {
            orders: orders,
        });
    });
});





router
.get('/view-order/:id',(req,res)=>{

    let id = req.params.id;
    
    Order.findById(id,(err, order)=>{
       

            if(err){
                console.log(err)
                res.redirect('/admin/orders')
            } else {

                        res.render('admin/view-order', {
                          cid:order.cid,
                          orderN:order.orderN,
                          total:order.total,
                          cart:order.cart,
                          paymentid:order.paymentid||'Not paid!',
                          date:order.date,
                          status:order.status,
                          id:id

                        })
                    
                

                

            }
        
     
    })

    
})

.post('/view-order/:id', (req,res)=>{
        
    let status = req.body.status;
    let id = req.params.id;

    Order.findById(id, (err, o)=>{
        o.status = status;
        o.save(err => {
            err?console.log(err):res.redirect('/admin/orders/view-order/'+ id)
        });
    })

});
        
      
   

router.get('/delete-order/:id', (req, res)=>{
   
    Order.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            console.log(err);
        }

        res.redirect('/admin/orders')
    })

})


//Exports
module.exports = router;