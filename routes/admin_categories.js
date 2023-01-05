const express = require('express')
const router = express.Router()
const Category = require('../models/category')


router.get('/',(req,res)=>{
    Category.find({}).sort({ sorting: 1 }).exec((err,categories)=>{
        if(!err){
            res.render('admin/categories',{categories:categories})
        }
    })

    
    
})


// sorting categories

const sortCategories = (cIds, callback)=>{

    

    let count = 0;

    for (let i = 0; i < cIds.length; i++) {
        let id = cIds[i];
        count++;
        (function (count) {
            Category.findById(id, (err, Category) => {
                Category.sorting = count;

                Category.save(err => {
                    if (err) return console.log(err)
                    ++count;
                    if(count>= cIds.length){
                        callback();
                    }
                });
            })
        })(count);
    }
}

router.post('/reorder-Category', async (req, res) => {
    let cIds = req.body['id[]'];

    sortCategories(cIds, ()=>{
        Category.find({}).sort({sorting: 1}).exec((err,Category)=>{
            if(err){
                console.log(err)
            } else{
                req.app.locals.categories = Category
            }
        })
    })

    
})







router.get('/add-category',(req,res)=>{
    let title = '';
    let slug = '';

    res.render('admin/add-category', {title:title,slug:slug})
})

router.post('/add-category',(req,res)=>{

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = title.replace(/\s+/g,'-').toLowerCase();
    
    
    Category.findOne({slug: slug}, (err, category)=>{
        if(!err){
            if(category){
                console.log('category is already exists!')
            } else{
                let categoryToAdd = new Category({
                    title: title,
                    slug: slug,
                    sorting: 100
                })

                categoryToAdd.save(err => {
                    err?console.log(err):res.redirect('/admin/categories')
                    req.app.locals.categories = categoryToAdd
                });
            }
        }else{
            console.log(err)
        }
    

    })
})


router
.get('/edit-category/:id',(req,res)=>{
    Category.findById(req.params.id, (err, category)=>{
    if(err){
        console.log(err)
    }else{
        res.render('admin/edit-category', {
            title:category.title,
            slug:category.slug,
            id:category._id
        })

    }
 })

    
})
.post('/edit-category/:id',(req,res)=>{

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = title.replace(/\s+/g,'-').toLowerCase();
    let id = req.params.id;

    Category.findOne({slug: slug, _id:{'$ne':id}}, (err, category)=>{
        if(!err){
            if(category){
                console.log('category slug is used!')
                res.render('admin/edit-category', {
                    title: title,
                    slug: slug,
                    id:id
                });
            } else{
                Category.findById(id, (err, category)=>{
                    if(!err){
                        category.title = title;
                        category.slug = slug;
                       
                        category.save(err => {
                        err?console.log(err):res.redirect('/admin/categories/edit-category/'+ id)
                        req.app.locals.categories = category
                    });
                    }
                })
            }
        }else{
            console.log(err)
        }
    

    })
       
   })

router.get('/delete-category/:id', (req, res)=>{

    Category.findByIdAndRemove(req.params.id, (err)=>{
        if(err) return console.log(err);
        
        Category.find((err,categories)=>{
            if(err){
                console.log(err);
            } else{
               req.app.locals.categories = categories
            }
        });

        res.redirect('/admin/categories')

    })

})


//Exports
module.exports = router;