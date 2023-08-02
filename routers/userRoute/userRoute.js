const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');

/**
* @swagger
* /api/v1/user/listAdvertisement:
*   get:
*     tags:
*       - ADVERTISEMENT MANAGEMENT IN USER DASHBOARD
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/listAdvertisement', userController.listAdvertisement);

/**
* @swagger
* /api/v1/user/listVetted:
*   get:
*     tags:
*       - USER VETTED MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/listVetted', userController.listVetted);

router.get('/topCoins', userController.topCoins);
router.get('/getPooCoinDetails', userController.getPooCoinDetails);
router.get('/getPooCoinDetailsTest', userController.getPooCoinDetailsTest);


/**
* @swagger
* /api/v1/user/listTopRightAdd:
*   get:
*     tags:
*       - USER TOP & RIGHT ADD MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/listTopRightAdd', userController.listTopRightAdd);

/**
* @swagger
* /api/v1/user/quotePrice:
*   post:
*     tags:
*       - QUOTE PRICE MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: baseCurrency
*         description: baseCurrency
*         in: formData
*         required: true
*       - name: quoteCurrency
*         description: quoteCurrency
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/quotePrice', userController.quotePrice);


/**
* @swagger
* /api/v1/user/tokenPrice:
*   post:
*     tags:
*       - QUOTE PRICE MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: baseCurrency
*         description: baseCurrency
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/tokenPrice', userController.tokenPrice);

/**
* @swagger
* /api/v1/user/inscriptionsList:
*   get:
*     tags:
*       - USER
*     description: Get Incription List 
*     produces:
*       - application/json
*     parameters:
*       - name: search
*         description: search ?? in query
*         in: query
*         required: false
*       - name: status
*         description: status ?? in query
*         enum: ["ACTIVE","BLOCK"]
*         in: query
*         required: false
*       - name: addedby
*         description: addedby ?? in query
*         enum: ["USER","ADMIN"]
*         in: query
*         required: false
*       - name: fromDate
*         description: fromDate ?? in query
*         in: query
*         required: false
*       - name: toDate
*         description: toDate ?? in query
*         in: query
*         required: false
*       - name: page
*         description: page ?? in query
*         in: query
*         required: false
*       - name: limit
*         description: limit ?? in query
*         in: query
*         required: false
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/inscriptionsList', userController.inscriptionsList);

/**
* @swagger
* /api/v1/user/connectWallet:
*   post:
*     tags:
*       - USER
*     description: Get Incription List 
*     produces:
*       - application/json
*     parameters:
*       - name: walletAddress
*         description: walletAddress 
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Wallet successfully connected.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/connectWallet', userController.connectWallet);

/**
* @swagger
* /api/v1/user/addVotes/{_id}:
*   get:
*     tags:
*       - USER
*     description: Get Incription List 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: walletAddress 
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: path
*         required: true
*     responses:
*       200:
*         description: Vote successfully added.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/addVotes/:_id', auth.verifyToken, userController.addVotes);

/**
* @swagger
* /api/v1/user/topVotes:
*   get:
*     tags:
*       - USER
*     description: Get top votes  
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Requested data found successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/topVotes', userController.topVotes);

/**
* @swagger
* /api/v1/user/buySlot:
*   post:
*     tags:
*       - USER
*     description: Get top votes  
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token of user 
*         in: header
*         required: true
*       - name: inscription
*         description: inscription 
*         in: formData
*         required: true
*       - name: title
*         description: title 
*         in: formData
*         required: true
*       - name: url
*         description: url 
*         in: formData
*         required: true
*       - name: clickTags
*         description: clickTags 
*         in: formData
*         required: true
*       - name: date
*         description: date 
*         in: formData
*         required: true
*       - name: position
*         description: position 
*         in: formData
*         required: true
*       - name: info
*         description: info 
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Requested data found successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/buySlot', auth.verifyToken, userController.buySlot);

/**
* @swagger
* /api/v1/user/uploadImage:
*   post:
*     tags:
*       - USER
*     description: Get top votes  
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token of user 
*         in: header
*         required: true
*       - name: file
*         description: file 
*         in: formData
*         type: file
*         required: true
*     responses:
*       200:
*         description: File upload success.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/uploadImage', auth.verifyToken, userController.uploadImage);

/**
* @swagger
* /api/v1/user/profile:
*   get:
*     tags:
*       - USER
*     description: Get top votes  
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token of user 
*         in: header
*         required: true
*     responses:
*       200:
*         description: Data found success.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/profile', auth.verifyToken, userController.profile);

module.exports = router;