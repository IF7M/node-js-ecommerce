const express = require('express')
const router = express.Router()
const Page = require('../models/page')



router.get('/',(req,res)=>{
    Page.find({}).sort({sonrting: 1}).exec((err,pages)=>{
        if(!err){
            res.render('admin/pages',{pages:pages})
        }
    })
    
})

router.get('/add-page',(req,res)=>{
    let title = '';
    let slug = '';
    let content = '';

    res.render('admin/add-page', {title:title,slug:slug,content:content})
})

router.post('/add-page',(req,res)=>{
    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = title.replace(/\s+/g,'-').toLowerCase();
    let content = req.body.content;
    
    Page.findOne({slug: slug}, (err, page)=>{
        if(!err){
            if(page){
                console.log('page is already exists!')
            } else{
                let pageToAdd = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sonrting: 100
                })

                 pageToAdd.save(err => {
                    err?console.log(err):res.redirect('/admin/pages')
                });
            }
        }else{
            console.log(err)
        }
    

    })
})


router
.get('/edit-page/:id',(req,res)=>{
 Page.findById(req.params.id, (err, page)=>{
    if(err){
        
        console.log(err._message)
        
    }else{
        res.render('admin/edit-page', {
            title:page.title,
            slug:page.slug,
            content:page.content,
            id:page._id
        })

    }
 })

    
})
.post('/edit-page/:id',(req,res)=>{

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = title.replace(/\s+/g,'-').toLowerCase();
    let content = req.body.content;
    let id = req.params.id;

    Page.findOne({slug: slug, _id:{'$ne':id}}, (err, page)=>{
        if(!err){
            if(page){
                console.log('page slug is used!')
                res.render('admin/edit-page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id:id
                });
            } else{
                Page.findById(id, (err, page)=>{
                    if(!err){
                       page.title = title;
                       page.slug = slug;
                       page.content = content;
                       
                       page.save(err => {
                        err?console.log(err):res.redirect('/admin/pages/edit-page/'+ id)
                    });
                    }
                })
            }
        }else{
            console.log(err)
        }
    

    })
       
   })

router.get('/delete-page/:id', (req, res)=>{

    Page.findByIdAndRemove(req.params.id, (err)=>{
        if(err) return console.log(err);

        res.redirect('/admin/pages')

    })

})


//Exports
module.exports = router;