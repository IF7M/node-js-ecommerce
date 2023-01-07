require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT;
const DBLINK = process.env.DBLINK;

//DB connection
mongoose.connect(DBLINK,(err)=>{
    !err?console.log('db connected!'):console.log(err)
});



// app init
const app = express();

// setup

app.set('view engine', 'ejs'); // ejs 


// app use


/// static files
/// static files
app.use(express.static(__dirname));
app.use(express.static('public'));

// page model 
const Page = require('./models/page')

// get pages 
Page.find({}).sort({sorting: 1}).exec((err,pages)=>{
    if(err){
        console.log(err);
    } else{
       app.locals.pages = pages
       
    }
});

// category model 
const Category = require('./models/category')

// get categories 
Category.find((err,categories)=>{
    if(err){
        console.log(err);
    } else{
       app.locals.categories = categories
    }
});

/// body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
/// sesstion middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }));

// cart 
app.get('*', (req,res,next)=>{
    res.locals.cart = req.session.cart;
    next();
});


//set routes
const pages = require('./routes/pages');
const cart = require('./routes/cart');
const products = require('./routes/products');
const admin = require('./routes/admin_main');
const adminPages = require('./routes/admin_pages');
const adminCategories = require('./routes/admin_categories');
const adminProducts = require('./routes/admin_products');
const adminAds = require('./routes/admin_ads');

//// admin routes
app.use('/admin', admin);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/admin/ads', adminAds);

//// shop routes
app.use('/', pages);
app.use('/products', products);
app.use('/cart', cart);



// start server
app.listen(PORT,(err)=>{
    !err?console.log(`server is on using port ${PORT}, http://localhost:${PORT}`):console.log(err)
});

