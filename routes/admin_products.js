const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const multer  = require('multer')
const path = require('path')

const Product = require('../models/product');
const Category = require('../models/category')

// set dirname
router.use(express.static(__dirname));
router.use(express.static('public'));
// multer config
const storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
    
      cb(null, path.join(__dirname,"../public/products_imgs/"));
     
    },
    filename:  (req, file, cb)=> {
        let imgName = req.body.name;
        let newImgName = imgName.replace(/\s+/g,'-').toLowerCase();
        let randomAddOn = file.originalname.at(0)+ Math.floor(Math.random()*5);
        
        const imgFinalName = newImgName + '-' + randomAddOn + Date.now() + '.' + file.mimetype.split('/')[1];
       
        cb(null, imgFinalName)
        
    }
  })
  

  const upload = multer({ storage: storage }).any()
 


  //upload api test
  router.post('/upload',upload, (req, res)=>{

    console.log( req.files[0].filename)
    res.send('uploaded');

  })

router.get('/', (req,res)=>{

Product.find((err, products)=>{
    res.render('admin/products',{
        products: products,
       
    });
});
})

router.get('/add-product',(req,res)=>{
    let name = '';
    let slug = '';
    let sdesc = '';
    let desc = '';
    let price = 0.00;
    let sprice = 0.00;
    let quantity = 0;

Category.find((err, categories)=>{
    res.render('admin/add-product', {
        name: name,
        slug: slug,
        sdesc: sdesc,
        desc: desc,
        categories: categories,
        price: price,
        sprice: sprice,
        quantity: quantity
    })
})
   
})



router.post('/add-product', upload, (req,res)=>{

    let name = req.body.name;
    let sdesc = req.body.sdesc;
    let desc = req.body.desc;
    let price = req.body.price;
    let sprice = req.body.sprice;
    let quantity = req.body.quantity;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = name.replace(/\s+/g,'-').toLowerCase();
    let thumbImg;
    req.files.length > 0 ? thumbImg = req.files[0].filename : thumbImg = ''
    let gallery = [];
    req.files.forEach(img=>{
       gallery.push(img.filename)
    });
   
    let category = req.body.category;

    

    

    Product.findOne({slug:slug},(err, product)=>{
        if(product){
            console.log('product is already exists!')
            Category.find((err, categories)=>{
                res.render('admin/add-product', {
                name: name,
                slug: slug,
                sdesc: sdesc,
                desc: desc,
                categories: categories,
                price: price,
                sprice: sprice,
                quantity: quantity
            })})
            
        }else {

                        let priceFloat = parseFloat(price).toFixed(2);
                        let spriceFloat = parseFloat(sprice).toFixed(2);
                        let theProduct = new Product({
                            name: name,
                            slug: slug,
                            sdesc: sdesc,
                            desc: desc,
                            category: category,
                            price: priceFloat,
                            sprice: spriceFloat,
                            quantity: quantity,
                            thumbImg: thumbImg,
                            gallery: gallery
                        })
    
                        theProduct.save(async (err)=>{
                            if(err){
                                console.log(err)
                            } else {
                                res.redirect('/admin/products');
                            }
                                
                           
                        })

                        
    
                    }
                })

     

})


router
.get('/edit-product/:id',(req,res)=>{

    Category.find((err, categories)=>{
        Product.findById(req.params.id, (err, p)=>{
            if(err){
                console.log(err)
                res.redirect('/admin/products')
            } else {

                let gallery = p.gallery;
                
                    if(!err){
                        res.render('admin/edit-product', {
                            name: p.name,
                            slug: p.slug,
                            sdesc: p.sdesc,
                            desc: p.desc,
                            categories: categories,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            price: p.price,
                            sprice: p.sprice,
                            quantity: p.quantity,
                            thumbImg: p.thumbImg,
                            gallery: p.gallery,
                            id: p._id
                        })
                    }
                

                

            }
        })
     
    })

    
})

.post('/edit-product/:id', upload, (req,res)=>{
        
    let name = req.body.name;
    let sdesc = req.body.sdesc;
    let desc = req.body.desc;
    let price = req.body.price;
    let sprice = req.body.sprice;
    let quantity = req.body.quantity;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = name.replace(/\s+/g,'-').toLowerCase();
    let thumbImg;
    req.files.length > 0 ? thumbImg = req.files[0].filename : thumbImg = ''
    let gallery = [];
    req.files.forEach(img=>{
       gallery.push(img.filename)
    });
    let category = req.body.category;
    let id = req.params.id;

    Product.findOne({slug:slug, _id:{'$ne':id}}, (err, p)=>{
        if(!err){

            if(p){
                console.log('product slug exists!')
                res.redirect('/admin/products/edit-product/'+ id)
            } else{
                Product.findById(id, (err, p)=>{
                    if(err){
                        console.log(err)
                    } else {
                        p.name = name
                        p.slug = slug
                        p.sdesc = sdesc
                        p.desc = desc
                        p.category = category
                        p.price = parseFloat(price).toFixed(2)
                        p.sprice = parseFloat(sprice).toFixed(2)
                        p.quantity = quantity
                        if(gallery.length > 0){
                            p.thumbImg = thumbImg
                            p.gallery = gallery
                        }

                        p.save(err => {
                            err?console.log(err):res.redirect('/admin/products/edit-product/'+ id)
                        });
                        
                    }
                })
            }
            

        }
    })

    
})
   

router.get('/delete-product/:id', (req, res)=>{
    let pImg;
    let pgallary;
    Product.findByIdAndRemove(req.params.id, async (err,p)=>{
        if(err){
            console.log(err);
        }else{
            pImg = p.thumbImg
            pgallary = p.gallery
            
        }

        if(pImg !== ''){
            fs.remove(`public/products_imgs/${pImg}`,(err)=>{
                if(err) return console.log(err);
            })
        }
        
        if(pgallary.length>1){
            pgallary.forEach(img=>{
                fs.remove(`public/products_imgs/${img}`, (err)=>{
                    if(err) return console.log(err);
                })
            })
        }
        
        res.redirect('/admin/products')
        
    })

})


//Exports
module.exports = router;