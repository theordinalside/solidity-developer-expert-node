const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');


var auth = require('../../middleware/auth');

/**
 * @swagger
 * /api/v1/admin/logIn:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Your login is successful
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error
 */
router.post('/logIn', adminController.login);

/**
 * @swagger
 * /api/v1/admin/forgotPassword:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email/mobile number
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Otp has been sent to your registered email successfully
 *       404:
 *         description: Provided email is not registered.
 *       500:
 *         description: Internal Server Error
 */

router.post('/forgotPassword', adminController.forgotPassword);
/**
 * @swagger
 * /api/v1/admin/resetPassword/{_id}:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: path
 *         required: true
 *       - name: newPassword
 *         description: newPassword
 *         in: formData
 *         required: true
 *       - name: confirmPassword
 *         description: confirmPassword
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your password was Successfully Updated
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/resetPassword/:_id', adminController.resetPassword);

/**
 * @swagger
 * /api/v1/admin/profile:
 *   get:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully
 *       404:
 *         description: This user does not exist
 *       500:
 *         description: Internal Server Error
 */

router.get('/profile', auth.verifyToken, adminController.getProfile);

/**
 * @swagger
 * /api/v1/admin/profile:
 *   put:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: profilePic
 *         description: profilePic
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.put('/profile', auth.verifyToken, adminController.editProfile);

/**
 * @swagger
 * /api/v1/admin/changePassword:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token 
 *         description: token
 *         in: header
 *         required: true
 *       - name: oldPassword
 *         description: oldPassword
 *         in: formData   
 *         required: true
 *       - name: newPassword
 *         description: newPassword
 *         in: formData   
 *         required: true
 *       - name: confirmPassword
 *         description: confirmPassword
 *         in: formData   
 *         required: true
 *             
 *     responses:
 *       200:
 *         description: password successfully.
 *       404:
 *         description: user not found.
 *       500:
 *         description: Internal Server Error
 */

router.post("/changePassword", auth.verifyToken, adminController.changePassword);

/**
* @swagger
* /api/v1/admin/addAdvertisement:
*   post:
*     tags:
*       - ADVERTISEMENT MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: image
*         description: image ?? base64
*         in: formData
*         required: false
*       - name: title
*         description: title 
*         in: formData
*         required: false
*       - name: description
*         description: description
*         in: formData
*         required: false
*       - name: addType
*         description: addType ?? "LARGE" || "SMALL"
*         in: formData
*         required: false
*       - name: active
*         description: active ?? Boolean type true || false
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Data is saved successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/addAdvertisement', auth.verifyToken, adminController.addAdvertisement);


/**
 * @swagger
 * /api/v1/admin/viewAdvertisement/{_id}:
 *   get:
 *     tags:
 *       - ADVERTISEMENT MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ?? in header
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id 
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error
 */
router.get('/viewAdvertisement/:_id', auth.verifyToken, adminController.viewAdvertisement);

/**
* @swagger
* /api/v1/admin/editAdvertisement:
*   put:
*     tags:
*       - ADVERTISEMENT MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*       - name: image
*         description: image ?? base64
*         in: formData
*         required: false
*       - name: title
*         description: title 
*         in: formData
*         required: false
*       - name: description
*         description: description
*         in: formData
*         required: false
*       - name: active
*         description: active ?? Boolean type true || false
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Successfully updated.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.put('/editAdvertisement', auth.verifyToken, adminController.editAdvertisement);

/**
* @swagger
* /api/v1/admin/deleteAdvertisement:
*   delete:
*     tags:
*       - ADVERTISEMENT MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Successfully deleted.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.delete('/deleteAdvertisement', auth.verifyToken, adminController.deleteAdvertisement);


/**
* @swagger
* /api/v1/admin/listAdvertisement:
*   get:
*     tags:
*       - ADVERTISEMENT MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/listAdvertisement', auth.verifyToken, adminController.listAdvertisement);

/**
* @swagger
* /api/v1/admin/enableDisableAdvertisement:
*   put:
*     tags:
*       - ADVERTISEMENT MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*       - name: active
*         description: active ?? Boolean type true || false
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Data has been enabled successfully. || Data has been disabled successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.put('/enableDisableAdvertisement', auth.verifyToken, adminController.enableDisableAdvertisement);



/**
* @swagger
* /api/v1/admin/addVetted:
*   post:
*     tags:
*       - ADMIN VETTED MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: tokenId
*         description: tokenId 
*         in: formData
*         required: false
*       - name: name
*         description: name 
*         in: formData
*         required: false
*       - name: websiteUrl
*         description: websiteUrl 
*         in: formData
*         required: false
*       - name: telegramUrl
*         description: telegramUrl 
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Data is saved successfully.
*       404:
*         description: This token id is already in use.
*       500:
*         description: Internal Server Error
*/
router.post('/addVetted', auth.verifyToken, adminController.addVetted);


/**
 * @swagger
 * /api/v1/admin/viewVetted/{_id}:
 *   get:
 *     tags:
 *       - ADMIN VETTED MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ?? in header
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id 
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error
 */
router.get('/viewVetted/:_id', auth.verifyToken, adminController.viewVetted);

/**
* @swagger
* /api/v1/admin/editVetted:
*   put:
*     tags:
*       - ADMIN VETTED MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*       - name: tokenId
*         description: tokenId 
*         in: formData
*         required: false
*       - name: name
*         description: name 
*         in: formData
*         required: false
*       - name: websiteUrl
*         description: websiteUrl 
*         in: formData
*         required: false
*       - name: telegramUrl
*         description: telegramUrl 
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Successfully updated.
*       404:
*         description: This token id is already in use.
*       500:
*         description: Internal Server Error
*/
router.put('/editVetted', auth.verifyToken, adminController.editVetted);

/**
* @swagger
* /api/v1/admin/deleteVetted:
*   delete:
*     tags:
*       - ADMIN VETTED MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Successfully deleted.
*       404:
*         description: This token id is already in use.
*       500:
*         description: Internal Server Error
*/
router.delete('/deleteVetted', auth.verifyToken, adminController.deleteVetted);

/**
* @swagger
* /api/v1/admin/listVetted:
*   get:
*     tags:
*       - ADMIN VETTED MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/listVetted', auth.verifyToken, adminController.listVetted);


// /**
// * @swagger
// * /api/v1/admin/addTopAdd:
// *   post:
// *     tags:
// *       - TOPADD MANAGEMENT
// *     description: Check for Social existence and give the access Token 
// *     produces:
// *       - application/json
// *     parameters:
// *       - name: token
// *         description: token ?? in header
// *         in: header
// *         required: true
// *       - name: image
// *         description: image ?? base64 
// *         in: formData
// *         required: true
// *       - name: url
// *         description: url 
// *         in: formData
// *         required: true
// *     responses:
// *       200:
// *         description: Data is saved successfully.
// *       404:
// *         description: This token id is already in use.
// *       500:
// *         description: Internal Server Error
// */
// router.post('/addTopAdd',auth.verifyToken, adminController.addTopAdd);


/**
 * @swagger
 * /api/v1/admin/viewAdd/{_id}:
 *   get:
 *     tags:
 *       - ADD MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token ?? in header
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id 
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error
 */
router.get('/viewAdd/:_id', auth.verifyToken, adminController.viewTopAdd);

/**
* @swagger
* /api/v1/admin/editAdd:
*   put:
*     tags:
*       - ADD MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*       - name: image
*         description: image ?? base64 
*         in: formData
*         required: false
*       - name: url
*         description: url 
*         in: formData
*         required: false
*       - name: type
*         description: type ?? TOP || RIGHT 
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Successfully updated.
*       404:
*         description: This token id is already in use.
*       500:
*         description: Internal Server Error
*/
router.put('/editAdd', auth.verifyToken, adminController.editTopAdd);

/**
* @swagger
* /api/v1/admin/deleteAdd:
*   delete:
*     tags:
*       - ADD MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Successfully deleted.
*       404:
*         description: This token id is already in use.
*       500:
*         description: Internal Server Error
*/
router.delete('/deleteAdd', auth.verifyToken, adminController.deleteTopAdd);

/**
* @swagger
* /api/v1/admin/listAdd:
*   get:
*     tags:
*       - ADD MANAGEMENT
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/listAdd', auth.verifyToken, adminController.listTopAdd);

router.post('/uploadMultipleImage', auth.verifyToken, adminController.uploadMultipleImage);





/**
* @swagger
* /api/v1/admin/addMultipleInscriptions:
*   post:
*     tags:
*       - ADD MANAGEMENT
*     description: Add Incriptions 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - in: body
*         name: Object.
*         description: Parameters for add update fee discounts.
*         schema:
*           type: object
*           required:
*             - saveArr
*           properties:
*             saveArr:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   url:
*                     type: string
*                   title:
*                     type: string
*                   clickTags:
*                     type: string
*     responses:
*       200:
*         description: Details have been added successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.post('/addMultipleInscriptions', auth.verifyToken, adminController.addMultipleInscriptions);

/**
* @swagger
* /api/v1/admin/inscriptionsList:
*   get:
*     tags:
*       - ADD MANAGEMENT
*     description: Get Incription List 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
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
router.get('/inscriptionsList', auth.verifyToken, adminController.inscriptionsList);

/**
* @swagger
* /api/v1/admin/activeInscriptionsList:
*   get:
*     tags:
*       - ADD MANAGEMENT
*     description: Get Incription List 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
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
router.get('/activeInscriptionsList', auth.verifyToken, adminController.activeInscriptionsList);


/**
* @swagger
* /api/v1/admin/editInscription/{_id}:
*   put:
*     tags:
*       - ADD MANAGEMENT
*     description: Update Incription 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: path
*         required: true
*       - name: url
*         description: url 
*         in: formData
*         required: false
*       - name: title
*         description: title 
*         in: formData
*         required: false
*       - name: clickTags
*         description: clickTags 
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Details have been updated successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.put('/editInscription/:_id', auth.verifyToken, adminController.editInscription);

/**
* @swagger
* /api/v1/admin/deleteInscription/{_id}:
*   delete:
*     tags:
*       - ADD MANAGEMENT
*     description: Delete Incription 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: path
*         required: true
*     responses:
*       200:
*         description: Details have been deleted successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.delete('/deleteInscription/:_id', auth.verifyToken, adminController.deleteInscription);

/**
* @swagger
* /api/v1/admin/deleteAllInscription:
*   delete:
*     tags:
*       - ADD MANAGEMENT
*     description: Delete Incription 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Details have been deleted successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.delete('/deleteAllInscription', auth.verifyToken, adminController.deleteAllInscription);

/**
* @swagger
* /api/v1/admin/updateSetting:
*   put:
*     tags:
*       - ADD MANAGEMENT
*     description: updateSetting
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*       - name: _id
*         description: _id 
*         in: query
*         required: true
*       - name: value
*         description: value
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Details have been updated successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.put('/updateSetting', auth.verifyToken, adminController.updateSetting);

/**
* @swagger
* /api/v1/admin/viewSettings:
*   get:
*     tags:
*       - ADD MANAGEMENT
*     description: viewSettings
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Details have been get successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.get('/viewSettings', auth.verifyToken, adminController.viewSettings);

/**
* @swagger
* /api/v1/admin/clearSettings:
*   delete:
*     tags:
*       - ADD MANAGEMENT
*     description: clearSettings
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token ?? in header
*         in: header
*         required: true
*     responses:
*       200:
*         description: Details have been deleted successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error
*/
router.delete('/clearSettings', auth.verifyToken, adminController.clearSettings);


module.exports = router;