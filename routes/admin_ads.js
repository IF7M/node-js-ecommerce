const express = require('express')
const router = express.Router()
const Ads = require('../models/ads')
const multer  = require('multer')
const fs = require('fs-extra');
const path = require('path')



// set dirname
router.use(express.static(__dirname));
router.use(express.static('public'));
// multer config
const storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
    
      cb(null, path.join(__dirname,"../public/ads_imgs/"));
     
    },
    filename:  (req, file, cb)=> {
        let imgName = req.body.title;
        let newImgName = imgName.replace(/\s+/g,'-').toLowerCase();
       
        const imgFinalName = newImgName  + '.' + file.mimetype.split('/')[1];
       
        cb(null, imgFinalName)
        
    }
  })
  

  const upload = multer({ storage: storage }).any()
 



router.get('/',(req,res)=>{
    Ads.find((err,ads)=>{
        if(!err){
            
            res.render('admin/ads',{ads:ads})
        }
    })
    
})

router
.get('/add-ad',(req,res)=>{
    let title = '';
    let linkto = '';
    res.render('admin/add-ad', {title:title,linkto:linkto})
})

.post('/add-ad', upload, (req,res)=>{
    let title = req.body.title;
    let linkto = req.body.linkto.replace(/\s+/g,'-').toLowerCase();
    let ad;
    req.files.length > 0 ? ad = req.files[0].filename : ad = ''
    if(ad == ''){
        console.log('ad img is required!')
        res.render('admin/add-ad', {
            title:title,
            linkto:linkto
        })
    } else{
        Ads.create({title:title,linkto:linkto,ad:ad});
        res.redirect('/admin/ads');
    }
    
})


router
.get('/edit-ad/:id',(req,res)=>{

 Ads.findById(req.params.id, (err, ad)=>{
    if(err){
        
        console.log(err._message)
        res.redirect('/admin/ads');
        
    }else{
        res.render('admin/edit-ad', {
            title:ad.title,
            linkto:ad.linkto,
            ad:ad.ad,
            id:ad._id
        })

    }
 })

    
})
.post('/edit-ad/:id', upload, (req,res)=>{

    let title = req.body.title;
    let linkto = req.body.linkto.replace(/\s+/g,'-').toLowerCase();
    let ad;
    req.files.length > 0 ? ad = req.files[0].filename : ad = ''
    let id = req.params.id
   
        Ads.findById(id, (err,a)=>{
            if(!err){
                a.title = title
                a.linkto = linkto
                if(ad != ''){
                    a.ad = ad
                }
                
                a.save(err => {
                    err?console.log(err):res.redirect('/admin/ads/edit-ad/'+ id)
                });
            } else{
                console.log(err)
            }
        });
    
       
   })

router.get('/delete-ad/:id', (req, res)=>{
let adImg;
    Ads.findByIdAndRemove(req.params.id, async (err,a)=>{
        if(err){
            console.log(err);
        }else{
             adImg = `public/ads_imgs/${a.ad}`
        }
        if(adImg !== ''){
            fs.remove(adImg,(err)=>{
                if(err) return console.log(err);
            })
        }
        
        
        res.redirect('/admin/ads')

    })

})


//Exports
module.exports = router;