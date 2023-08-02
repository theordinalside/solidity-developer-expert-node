const commonFunction = require('../helper/commonFunction');
const contactUsModel = require('../models/contactUsModel');
const userModel = require('../models/userModel');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

module.exports = {
    /**
    * Function Name :editContactUs
    * Description   : editContactUs in contactUs page management
    *
    * @return response
   */

    editContactUs: (req, res) => {
        try {
            contactUsModel.findOne({ _id: req.body.contactId, status: "ACTIVE" }, (findErr, findResult) => {
                if (findErr) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    contactUsModel.findByIdAndUpdate({ _id: findResult._id }, { $set: req.body }, { new: true }, (err, success) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.UPDATE_SUCCESS);
                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewContactUs
     * Description   : viewContactUs in contactUs page managemen
     *
     * @return response
    */

    viewContactUs: (req, res) => {
        try {
            contactUsModel.findOne({ _id: req.params.contactId, status: "ACTIVE" }, (err, staticResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!staticResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, staticResult, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
     * Function Name :contactUsList
     * Description   : contactUsList in contactUs page managemen
     *
     * @return response
    */

    contactUsList: (req, res) => {
        try {
            contactUsModel.find({ status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    //******************************ends of exports*********************/
}