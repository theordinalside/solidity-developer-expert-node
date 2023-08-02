const express = require('express')
const router=express.Router()
var async = require('async')


const apiController = require('../controllers/controler');

router.get('/allApi', apiController.allApi);



module.exports = router;
