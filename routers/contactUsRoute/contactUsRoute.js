const express = require('express');
const router = express.Router();
const contactUsController = require('../../controllers/contactUsController');


/**
 * @swagger
 * /api/v1/contactUs/editContactUs:
 *   put:
 *     tags:
 *       - CONTACT US
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: contactId 
 *         description: contactId ?? _id
 *         in: formData
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: type
 *         description: type
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
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

 router.put('/editContactUs' , contactUsController.editContactUs);

 /**
  * @swagger
  * /api/v1/contactUs/viewContactUs/{contactId}:
  *   get:
  *     tags:
  *       - CONTACT US
  *     description: Check for Social existence and give the access Token 
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: contactId
  *         description: contactId ?? _id
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
 
 router.get('/viewContactUs/:contactId' , contactUsController.viewContactUs);
 
 /**
  * @swagger
  * /api/v1/contactUs/contactUsList:
  *   get:
  *     tags:
  *       - CONTACT US
  *     description: Check for Social existence and give the access Token 
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Requested data found.
  *       404:
  *         description: Requested data not found.
  *       500:
  *         description: Internal Server Error
  */
 
 router.get('/contactUsList',contactUsController.contactUsList);
module.exports = router;