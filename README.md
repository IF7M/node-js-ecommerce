## About

This shopping cart was built using Node js and Ejs view engine, and Mongodb database.
the script is open-source and totally customizable.

-------

## Prerequisites

* [Node](https://nodejs.org) v18.12.1
* [NPM](https://npmjs.com/) v8.19.2
* [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

-------

## Install:

`$ git clone https://github.com/IF7M/node-js-ecommerce.git`

`$ npm install`

`$ cd node-js-ecommerce`

`$ touch .env`

-------



## .env file shoud containe:

`PORT=0000` // Port number for the server
`DBLINK='mongodbXXXXXXXXXXXXXXXXX.XXX/XXX'` // Database link
`SESSION_SECRET= XXXXXXXXXXXXXXXXXXXXX` // Secret string
`PAYPAL_CLIENT_ID='XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'` // Paypal config
`PAYPAL_SECRET='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'` // Paypal config

-------

## Currency
the currency used is SAR and was exchanged to USD in checkout and orders DB, because Paypal doesn't support SAR.
you can use any currency, just change it in:
routes > cart.js && views > pages > thanku.ejs
then change the other views where the currency is shown.

-------

## License

Released under the **[MIT License](http://mit-license.org/)**

By **[IF7M](https://github.com/IF7M)**
