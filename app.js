require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');

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
app.use(express.static('public'));
// file upload middleware
app.use(fileUpload());
/// body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
/// sesstion middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

//set routes
const pages = require('./routes/pages');
const admin = require('./routes/admin_main');
const adminPages = require('./routes/admin_pages');
const adminCategories = require('./routes/admin_categories');
const adminProducts = require('./routes/admin_products');

//// admin routes
app.use('/admin', admin);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
//// shop routes

app.use('/', pages);
app.use('/login', pages);



// start server
app.listen(PORT,(err)=>{
    !err?console.log(`server is on using port ${PORT}, http://localhost:${PORT}`):console.log(err)
});

