// //node-solidityexpert.mobiloitte.io
const commonFunction = require('../helper/commonFunction');
const contactUsModel = require('../models/contactUsModel');
const topRightAddModel = require('../models/topRightAddModel');
const userModel = require('../models/userModel');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
var bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const advertisementModel = require('../models/advertisementModel');
const vettedModel = require('../models/vettedModel');
const path = require('path');
const fs = require('fs');
const ads = require('../models/userAddsModel');
const vote = require('../models/vote');
const setting = require('../models/setting');
module.exports = {


    /**
  * Function Name :login
  * Description   : login for admin
  *
  * @return response
 */

    login: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email, userType: { $in: ["SUBADMIN", "ADMIN"] } }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    const check = bcrypt.compareSync(req.body.password, userData.password)
                    if (check) {
                        var token = jwt.sign({ id: userData._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'fullstack_blockchain', { expiresIn: '24h' });
                        let result = {
                            userId: userData._id,
                            token: token,
                            name: userData.name,
                            email: userData.email,
                            mobileNumber: userData.mobileNumber,
                            userType: userData.userType
                        };
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
                    }
                    else {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL)
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
     * Function Name :forgotPassword
     * Description   : forgotPassword for admin
     *
     * @return response
    */

    forgotPassword: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email, status: "ACTIVE", userType: "ADMIN" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    commonFunction.sendLink(result.email, result.name, result._id, (emailErr, emailResult) => {
                        if (emailErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!emailResult) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var data = result._id;
                            response(res, SuccessCode.SUCCESS, data, SuccessMessage.FORGET_SUCCESS);
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
     * Function Name :resetPassword
     * Description   : resetPassword for admin
     *
     * @return response
    */

    resetPassword: (req, res) => {
        try {
            userModel.findOne({ _id: req.params._id, status: "ACTIVE", userType: "ADMIN" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    req.body.password = bcrypt.hashSync(req.body.newPassword);
                    var confirmPassword = bcrypt.hashSync(req.body.confirmPassword);
                    var check = bcrypt.compareSync(req.body.newPassword, confirmPassword);
                    if (!check) {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.NOT_MATCH);
                    }
                    else {
                        userModel.findOneAndUpdate({ _id: req.params._id }, { $set: { password: confirmPassword } }, { new: true }, (updateErr, updateResult) => {
                            if (updateErr) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.PASSWORD_UPDATE);
                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :getProfile
     * Description   : getProfile of admin
     *
     * @return response
    */

    getProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "ADMIN" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editProfile
     * Description   : editProfile of admin
     *
     * @return response     
    */

    editProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "ADMIN" }, (err, adminResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findOne({ email: req.body.email, status: { $ne: "DELETE" }, _id: { $ne: adminResult._id } }, (err2, result) => {
                        if (err2) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                        }
                        else {
                            if (req.body.profilePic) {
                                commonFunction.uploadImage(req.body.profilePic, (imageErr, imageResult) => {
                                    if (imageErr) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        req.body.profilePic = imageResult;
                                        userModel.findOneAndUpdate({ _id: adminResult._id }, { $set: req.body }, { new: true }, (updateErr, updateResult) => {
                                            if (updateErr) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                userModel.findOneAndUpdate({ _id: adminResult._id }, { $set: req.body }, { new: true }, (updateErr, updateResult) => {
                                    if (updateErr) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    changePassword: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] }, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var OldPassword = bcrypt.compareSync(req.body.oldPassword, result.password)
                    if (OldPassword) {
                        if (req.body.newPassword == req.body.confirmPassword) {
                            var newPassword = bcrypt.hashSync(req.body.newPassword)
                            userModel.findOneAndUpdate({ _id: result._id }, { $set: { password: newPassword } }, { new: true },
                                (err, passwordChanged) => {
                                    if (err) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, passwordChanged, SuccessMessage.PASSWORD_UPDATE)
                                    }
                                })
                        }
                        else {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_MATCH)
                        }
                    }
                    else {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OLD_PASSWORD)
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, error, ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
* Function Name : addAdvertisement
* Description   : addAdvertisement for admin in advertisement management
*
* @return response
*/
    addAdvertisement: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var saved;
                var query = { addType: req.body.addType, status: { $ne: "DELETE" } }
                var count = await advertisementModel.count(query);
                if ((req.body.addType == "LARGE" && count < 8) || (req.body.addType == "SMALL" && count < 20)) {
                    req.body.image = await convertImage(req.body.image);
                    saved = await new advertisementModel(req.body).save();
                    if (saved) {
                        response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
                    }
                } else {
                    response(res, ErrorCode.NOT_ALLOWED, [], ErrorMessage.LIMIT_EXCEEDED)
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
    * Function Name : viewAdvertisement
    * Description   : viewAdvertisement for admin in advertisement management
    *
    * @return response
    */
    viewAdvertisement: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await advertisementModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },


    /**
    * Function Name : editAdvertisement
    * Description   : editAdvertisement for admin in advertisement management
    *
    * @return response
    */
    editAdvertisement: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await advertisementModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    if (req.body.image) {
                        req.body.image = await convertImage(req.body.image);
                    }
                    var updateRes = await advertisementModel.findByIdAndUpdate({ _id: resultData._id }, { $set: req.body }, { new: true });
                    if (updateRes) {
                        response(res, SuccessCode.SUCCESS, updateRes, SuccessMessage.UPDATE_SUCCESS);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
  * Function Name : deleteAdvertisement
  * Description   : deleteAdvertisement for admin in advertisement management
  *
  * @return response
  */
    deleteAdvertisement: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await advertisementModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    var updateRes = await advertisementModel.findByIdAndUpdate({ _id: resultData._id }, { $set: { status: "DELETE" } }, { new: true });
                    if (updateRes) {
                        response(res, SuccessCode.SUCCESS, updateRes, SuccessMessage.DELETE_SUCCESS);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
      * Function Name : listAdvertisement
      * Description   : listAdvertisement for admin in advertisement management
      *
      * @return response
      */
    listAdvertisement: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await advertisementModel.find({ status: { $ne: "DELETE" } });
                if (resultData.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
                }
            }

        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
    * Function Name : enableDisableAdvertisement
    * Description   : enableDisableAdvertisement for admin in advertisement management
    *
    * @return response
    */
    enableDisableAdvertisement: async (req, res) => {
        try {
            var result1 = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result1) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var result = await advertisementModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    if (result.active == false) {
                        var updateRes = await advertisementModel.findByIdAndUpdate({ _id: result._id }, { $set: { active: true } }, { new: true });
                        if (updateRes) {
                            response(res, SuccessCode.SUCCESS, updateRes, SuccessMessage.ENABLE_SUCCESS);
                        }
                    } else {
                        var updateRes1 = await advertisementModel.findByIdAndUpdate({ _id: result._id }, { $set: { active: false } }, { new: true });
                        if (updateRes1) {
                            response(res, SuccessCode.SUCCESS, updateRes1, SuccessMessage.DISABLE_SUCCESS);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },


    /**
* Function Name : addVetted
* Description   : addVetted for admin in vetted management
*
* @return response
*/
    addVetted: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var uniqueCheck = await vettedModel.findOne({ tokenId: req.body.tokenId, status: { $ne: "DELETE" } });
                if (uniqueCheck) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ALREADY_VETTED);
                } else {
                    saved = await new vettedModel(req.body).save();
                    if (saved) {
                        response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
    * Function Name : viewVetted
    * Description   : viewVetted for admin in vetted management
    *
    * @return response
    */
    viewVetted: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await vettedModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },


    /**
    * Function Name : editVetted
    * Description   : editVetted for admin in vetted management
    *
    * @return response
    */
    editVetted: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await vettedModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    var updateRes = await vettedModel.findByIdAndUpdate({ _id: resultData._id }, { $set: req.body }, { new: true });
                    if (updateRes) {
                        response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.UPDATE_SUCCESS);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
* Function Name : deleteVetted
* Description   : deleteVetted for admin in vetted management
*
* @return response
*/
    deleteVetted: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await vettedModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    var updateRes = await vettedModel.findByIdAndUpdate({ _id: resultData._id }, { $set: { status: "DELETE" } }, { new: true });
                    if (updateRes) {
                        response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DELETE_SUCCESS);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
      * Function Name : listVetted
      * Description   : listVetted for admin in vetted management
      *
      * @return response
      */
    listVetted: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await vettedModel.find({ status: { $ne: "DELETE" } });
                if (resultData.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
                }
            }

        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    // /**
    // * Function Name : addTopAdd
    // * Description   : addTopAdd for admin in topadd management
    // *
    // * @return response
    // */
    // addTopAdd: async (req, res) => {
    //     try {
    //         var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
    //         if (!result) {
    //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //         } else {
    //             var uniqueCheck = await topRightAddModel.findOne({ url: req.body.url, status: { $ne: "DELETE" } });
    //             if (uniqueCheck) {
    //                 response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ALREADY_EXIST);
    //             } else {
    //                 req.body.image = await convertImage(req.body.image);
    //                 req.body.type = "TOP";
    //                 saved = await new topRightAddModel(req.body).save();
    //                 if (saved) {
    //                     response(res, SuccessCode.SUCCESS, saved, SuccessMessage.DATA_SAVED);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    //     }
    // },

    /**
    * Function Name : viewTopAdd
    * Description   : viewTopAdd for admin in topadd management
    *
    * @return response
    */
    viewTopAdd: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await topRightAddModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
    * Function Name : editTopAdd
    * Description   : editTopAdd for admin in topadd management
    *
    * @return response
    */
    editTopAdd: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await topRightAddModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    if (req.body.image) {
                        req.body.image = await convertImage(req.body.image);
                    }
                    var updateRes = await topRightAddModel.findByIdAndUpdate({ _id: resultData._id }, { $set: req.body }, { new: true });
                    if (updateRes) {
                        response(res, SuccessCode.SUCCESS, updateRes, SuccessMessage.UPDATE_SUCCESS);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
    * Function Name : deleteTopAdd
    * Description   : deleteTopAdd for admin in topadd management
    *
    * @return response
    */
    deleteTopAdd: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await topRightAddModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } });
                if (!resultData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    var updateRes = await topRightAddModel.findByIdAndUpdate({ _id: resultData._id }, { $set: { status: "DELETE" } }, { new: true });
                    if (updateRes) {
                        response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DELETE_SUCCESS);
                    }
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
      * Function Name : listTopAdd
      * Description   : listTopAdd for admin in topadd management
      *
      * @return response
      */
    listTopAdd: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
            if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                var resultData = await topRightAddModel.find({ status: { $ne: "DELETE" } });
                if (resultData.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
                }
            }
        } catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },


    uploadMultipleImage: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            let arr = [];
            if (req.files.file.length != 0) {
                for (const file of req.files.file) {
                    let image = await commonFunction.uploadImageNew(file.tempFilePath)
                    arr.push({
                        name: file.name,
                        type: file.mimetype,
                        url: image
                    });
                    const deleteFile = path.resolve(`/${file.tempFilePath}`);
                    deletePath(deleteFile);
                }
                return response(res, SuccessCode.SUCCESS, arr, SuccessMessage.UPLOAD_SUCCESS);

            }
            else {
                return response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.EMPTY_PARAMS);
            }

        } catch (error) {
            console.log("uploadMultipleImage", error)
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    addMultipleInscriptions: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            let data = [];
            const checkRecords = await ads.countDocuments();
            if (checkRecords > 0) {
                return response(res, ErrorCode.NOT_ALLOWED, [], ErrorMessage.ALREADY_ADDED);
            }
            if (req.body.saveArr.length !== 0) {
                function splitIntoChunk(arr, chunk) {
                    while (arr.length > 0) {
                        data.push(arr.splice(0, chunk));
                    }
                }
                const array = req.body.saveArr;
                var x = await setting.findOne({ type: "limit" })
                const chunk = x == null ? 100 : x.value;
                let finalData = [];
                splitIntoChunk(array, chunk);
                if (data.length > 0) {
                    let count = 1;
                    for (let index = 0; index < data.length; index++) {
                        let arrData = [];
                        for (let j = 0; j < data[index].length; j++) {
                            arrData.push({
                                url: data[index][j].url,
                                title: data[index][j].title,
                                clickTags: data[index][j].clickTags,
                                inscription: j + 1,
                                active: count === 1 ? true : false,
                                isNext: count === 2 ? true : false,
                                date: new Date().toISOString()
                            });
                            if (j == data[index].length - 1) {
                                count += 1;
                                let result = await ads.insertMany(arrData);
                                finalData.push(result);
                                arrData = new Array();
                            }
                        }
                    }
                }
                updateIns();
                return response(res, SuccessCode.SUCCESS, finalData, SuccessMessage.UPLOAD_SUCCESS);
            }
            else {
                return response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.EMPTY_PARAMS);
            }
        } catch (error) {
            console.log("error==>>", error);
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    inscriptionsList: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            const { page, limit, search, status, addedby, fromDate, toDate } = req.query;
            let query = { status: { $ne: "DELETE" } };
            if (status) {
                query.status = status;
            };
            if (search) {
                query.title = { $regex: search, $options: "i" };
            };
            if (addedby) {
                query.addedBy = addedby;
            };
            if (fromDate && !toDate) {
                query.createdAt = { $gte: fromDate }
            };
            if (!fromDate && toDate) {
                query.createdAt = { $lte: toDate }
            };
            if (fromDate && toDate) {
                query.$and = [
                    {
                        createdAt: { $gte: fromDate }
                    },
                    {
                        createdAt: { $lte: toDate }
                    }
                ]
            };
            let options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: { createdAt: -1 }
            }
            let data = await ads.paginate(query, options);
            return response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND);
        } catch (error) {
            console.log(error)
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    activeInscriptionsList: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            const { page, limit, search, status, addedby, fromDate, toDate } = req.query;
            let query = { active: true, status: { $ne: "DELETE" } };
            if (status) {
                query.status = status;
            };
            if (search) {
                query.title = { $regex: search, $options: "i" };
            };
            if (addedby) {
                query.addedBy = addedby;
            };
            if (fromDate && !toDate) {
                query.createdAt = { $gte: fromDate }
            };
            if (!fromDate && toDate) {
                query.createdAt = { $lte: toDate }
            };
            if (fromDate && toDate) {
                query.$and = [
                    {
                        createdAt: { $gte: fromDate }
                    },
                    {
                        createdAt: { $lte: toDate }
                    }
                ]
            };
            let options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: { inscription: 1 }
            }
            let data = await ads.paginate(query, options);
            return response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND);
        } catch (error) {
            console.log(error)
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    editInscription: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            let ins = await ads.findOne(
                {
                    _id: req.params._id,
                    status:
                    {
                        $ne:
                            "DELETE"
                    }
                }
            );
            if (!ins) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            };
            let data = await ads.findByIdAndUpdate(
                {
                    _id: ins._id
                },
                {
                    $set: req.body
                },
                {
                    new: true
                }
            );
            return response(res, SuccessCode.SUCCESS, data, SuccessMessage.UPDATE_SUCCESS);
        } catch (error) {
            console.log("editInscription", error)
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },

    deleteInscription: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            let ins = await ads.findOne(
                {
                    _id: req.params._id,
                    status:
                    {
                        $ne:
                            "DELETE"
                    }
                }
            );
            if (!ins) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            };
            let data = await ads.findByIdAndUpdate(
                {
                    _id: ins._id
                },
                {
                    $set:
                    {
                        status: "DELETE"
                    }
                },
                {
                    new: true
                }
            );
            return response(res, SuccessCode.SUCCESS, data, SuccessMessage.DELETE_SUCCESS);
        } catch (error) {
            console.log("editInscription", error)
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },

    deleteAllInscription: async (req, res) => {
        try {
            var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN"] } })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            let data = await Promise.all([ads.deleteMany(), vote.deleteMany()])
            return response(res, SuccessCode.SUCCESS, data, SuccessMessage.DELETE_SUCCESS);
        } catch (error) {
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    updateSetting: async (req, res) => {
        try {
            var result = await setting.findOne({ _id: req.query._id })
            if (!result) {
                return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            let data = await setting.findByIdAndUpdate({ _id: result._id }, { $set: req.body }, { new: true })
            if (result.type == "price") {
                await ads.updateMany({}, { $set: { price: req.body.value } }, { multi: true })
            }
            return response(res, SuccessCode.SUCCESS, data, SuccessMessage.UPDATE_SUCCESS);
        } catch (error) {
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    viewSettings: async (req, res) => {
        try {
            var result = await setting.find({})
            return response(res, SuccessCode.SUCCESS, result, SuccessMessage.UPDATE_SUCCESS);
        } catch (error) {
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    clearSettings: async (req, res) => {
        try {
            var result = await setting.deleteMany({});
            await setting.insertMany([
                {
                    type: "price",
                    value: 0.0001
                }, {
                    type: "limit",
                    value: 100
                }
            ])
            return response(res, SuccessCode.SUCCESS, result, SuccessMessage.UPDATE_SUCCESS);
        } catch (error) {
            return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },



    //********************************ends of exports*******************/
}

function convertImage(profilePic) {
    return new Promise((resolve, reject) => {
        commonFunction.uploadImage(profilePic, (error, imageData) => {
            if (error) {
                resolve(error)
            }
            else {
                resolve(imageData)
            }
        })
    })
}

function deletePath(path) {
    fs.unlink(path, (err, res) => {
        if (err) {
            console.log("file delete error", err);
        }
        else {
            console.log("file deleted");
        }
    })
}

async function updateIns() {
    let insArr = [
        "#41471",
        "#43264",
        "#44099",
        "#44592",
        "#44597",
        "#45315",
        "#45316",
        "#45366",
        "#45482",
        "#45643",
        "#45691",
        "#45701",
        "#46079",
        "#46083",
        "#46163",
        "#46173",
        "#46285",
        "#46292",
        "#46293",
        "#46299",
        "#46353",
        "#46356",
        "#48495",
        "#48498",
        "#48499",
        "#48533",
        "#48572",
        "#48574",
        "#48576",
        "#48577",
        "#48656",
        "#48657",
        "#48658",
        "#48659",
        "#48660",
        "#48662",
        "#48665",
        "#48688",
        "#48726",
        "#48729",
        "#49586",
        "#49587",
        "#49588",
        "#49589",
        "#49755",
        "#50226",
        "#50227",
        "#50228",
        "#50229",
        "#50231",
        "#50233",
        "#50234",
        "#50237",
        "#50238",
        "#50240",
        "#50242",
        "#50243",
        "#50244",
        "#50245",
        "#50247",
        "#50248",
        "#50458",
        "#50715",
        "#51909",
        "#52128",
        "#52130",
        "#52148",
        "#52149",
        "#52152",
        "#52157",
        "#52159",
        "#52163",
        "#52188",
        "#52189",
        "#52200",
        "#52201",
        "#52204",
        "#52208",
        "#53551",
        "#53590",
        "#53780",
        "#58910",
        "#58915",
        "#60991",
        "#60994",
        "#60997",
        "#61008",
        "#61011",
        "#61017",
        "#61051",
        "#61052",
        "#61070",
        "#61074",
        "#61075",
        "#61102",
        "#61111",
        "#61266",
        "#61291",
        "#61292",
        "#61306"
    ];
    let data = await ads.find({ active: true });
    for (let i = 0; i < data.length; i++) {
        await ads.findByIdAndUpdate({ _id: data[i]._id }, { $set: { inscriptionNumber: insArr[i] } }, { new: true })
    }
}

