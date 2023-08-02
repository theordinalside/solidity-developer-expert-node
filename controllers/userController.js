const commonFunction = require('../helper/commonFunction');
const contactUsModel = require('../models/contactUsModel');
const userModel = require('../models/userModel');
const topCoinModel = require('../models/topCoinModel')
const topRightAddModel = require('../models/topRightAddModel');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
var bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const advertisementModel = require('../models/advertisementModel');
const vettedModel = require('../models/vettedModel');
const axios = require('axios');
const got = require('got');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false
});

const ads = require('../models/userAddsModel');
const vote = require('../models/vote');
const slotModel = require('../models/slotModel');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
module.exports = {

  /**
    * Function Name : listAdvertisement
    * Description   : listAdvertisement for user in advertisement management
    *
    * @return response
    */
  listAdvertisement: async (req, res) => {
    try {
      var result = await advertisementModel.find({ status: { $ne: "DELETE" } });
      if (result.length == 0) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      } else {
        response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
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
      var resultData = await vettedModel.find({ status: { $ne: "DELETE" } });
      if (resultData.length == 0) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      } else {
        response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
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
  topCoins: async (req, res) => {
    try {
      var finalArray = [];
      const result = await got.post('https://api1.poocoin.app/top-requests', {
        json: true, // this is required
        body: {
          age: '1d'
        }
      }); //
      const apiData = result.body.data.viewer.accounts[0].topPaths;
      const datatoSearch = apiData.map((item) => {
        const token = item.dimensions.metric.split("/");
        return token[2];
      });
      console.log("83======>>", datatoSearch)
      for (let i = 0; i < datatoSearch.length; i++) {
        let checkAddress = await topCoinModel.findOne({ address: datatoSearch[i], status: "ACTIVE" });
        if (checkAddress) {
          console.log("Address exist in dbs===>>", datatoSearch[i])
        } else {
          try {
            const result1 = await axios.post("https://graphql.bitquery.io", {
              json: true,
              query: `
                            {
                              ethereum(network: bsc) {
                                address(address: {in: "${datatoSearch[i]}"}) {
                                  smartContract {
                                    attributes {
                                      value
                                    }
                                    currency {
                                      decimals
                                      name
                                      symbol
                                    }
                                  }
                                }
                              }
                            }`
            })
            new topCoinModel({
              address: datatoSearch[i],
              decimals: result1.data.data.ethereum.address[0].smartContract.currency.decimals,
              name: result1.data.data.ethereum.address[0].smartContract.currency.name,
              symbol: result1.data.data.ethereum.address[0].smartContract.currency.symbol,
            }).save();
            console.log("saved result====>>");
            // finalArray.push(result1.data.data.ethereum.address[0].smartContract.currency);
            // console.log("result=====>>", result1.data.data.ethereum.address[0].smartContract.currency)
          } catch (e) {
            console.log({ responseCode: 403, responseMessage: "Request failed with 403", responseResult: e })
            // finalArray.push({ responseCode: 403, responseMessage: "Request failed with 403", responseResult: e });
          }
        }
        // if (i == datatoSearch.length - 1) {
        // }
      }
      let finalData = await topCoinModel.find().select('address name symbol decimals').limit(10).sort({ createdAt: -1 });
      response(res, SuccessCode.SUCCESS, finalData, SuccessMessage.DETAIL_GET);
    } catch (error) {
      console.log(error)
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  /**
* Function Name : getPooCoinDetails
* Description   : getPooCoinDetails for admin in getPooCoinDetails management
*
* @return response
*/
  getPooCoinDetails: async (req, res) => {
    try {
      const result = await got.post('https://api1.poocoin.app/top-requests', {
        json: true, // this is required
        body: {
          age: '1d'
        }
      }); //
      const apiData = result.body.data.viewer.accounts[0].topPaths;
      const datatoSearch = apiData.map((item) => {
        const token = item.dimensions.metric.split("/");
        return token[2];
      });
      console.log("111========>>", datatoSearch)
      response(res, SuccessCode.SUCCESS, datatoSearch, SuccessMessage.DETAIL_GET);
    } catch (error) {
      console.log(error)
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  /**
* Function Name : getPooCoinDetails
* Description   : getPooCoinDetails for admin in getPooCoinDetails management
*
* @return response
*/
  getPooCoinDetailsTest: async (req, res) => {
    try {
      const finalRes = await got.post("https://chartdata.poocoin.app/", {
        json: true,
        query:
          `query($tokens: [String!])
                     {
                           ethereum(network: bsc)
                           
                            {address(address: {in: $tokens}){
                                address smartContract {
                                     currency{symbol name}}}}}`,
        variables: {
          tokens: ["0xdb8b65fe5d8c2a3396c08e47588bb7fb6bd2569d", "0x163f182c32d24a09d91eb75820cde9fd5832b329"],
        },
      });
      console.log("120========??", finalRes)
      response(res, SuccessCode.SUCCESS, finalRes, SuccessMessage.DETAIL_GET);


    } catch (error) {
      console.log(error)
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  /**
* Function Name : listTopRightAdd
* Description   : listTopRightAdd for user in toprightadd management
*
* @return response
*/
  listTopRightAdd: async (req, res) => {
    try {
      // var result = await userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "USER"] } })
      // if (!result) {
      //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
      // } else {
      var resultData = await topRightAddModel.find({ status: { $ne: "DELETE" } });
      if (resultData.length == 0) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      } else {
        response(res, SuccessCode.SUCCESS, resultData, SuccessMessage.DETAIL_GET);
      }
      // }

    } catch (error) {
      console.log(error)
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },


  /**
  * Function Name : quotePrice
  * Description   : quotePrice for admin in vetted management
  *
  * @return response
  */
  quotePrice: async (req, res) => {
    try {
      const result = await axios.post("https://graphql.bitquery.io", {
        json: true,
        query: `
                    {
                        ethereum(network: bsc) {
                          dexTrades(
                            options: {desc: ["block.height", "tradeIndex"], limit: 1}
                            exchangeAddress: {in: ["0xca143ce32fe78f1f7019d7d551a6402fc5350c73", "0xbcfccbde45ce874adcb698cc183debcf17952812"]}
                            baseCurrency: {is: "${req.body.baseCurrency}"}
                            quoteCurrency: {is: "${req.body.quoteCurrency}"}
                          ) {
                            transaction {
                              hash
                            }
                            tradeIndex
                            smartContract {
                              address {
                                address
                              }
                              contractType
                              currency {
                                name
                              }
                            }
                            tradeIndex
                            block {
                              height
                            }
                            baseCurrency {
                              symbol
                              address
                            }
                            quoteCurrency {
                              symbol
                              address
                              name
                            }
                            quotePrice
                          }
                        }
                      }
                        `
      })
      console.log("result ====>>", result.data.data.ethereum);
      if (result.data.data.ethereum.dexTrades == null) {
        response(res, SuccessCode.SUCCESS, { quotePrice: null, quotePriceInBNB: null }, SuccessMessage.DETAIL_GET);
      } else {
        let obj = {
          quotePrice: result.data.data.ethereum.dexTrades[0].quotePrice,
          quotePriceInBNB: 1 / result.data.data.ethereum.dexTrades[0].quotePrice
        }
        response(res, SuccessCode.SUCCESS, obj, SuccessMessage.DETAIL_GET);
      }
    } catch (error) {
      console.log(error)
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },


  tokenPrice: async (req, res) => {
    try {
      const result1 = await axios.post("https://graphql.bitquery.io", {
        json: true,
        query: `{
                            ethereum(network: bsc) {
                              dexTrades(
                                options: {desc: ["block.height", "transaction.index"], limit: 1}
                                baseCurrency: {is: "${req.body.baseCurrency}"}
                                quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
                              ) {
                                block {
                                  height
                                  timestamp {
                                    time(format: "%Y-%m-%d %H:%M:%S")
                                  }
                                }
                                transaction {
                                  index
                                }
                                baseCurrency {
                                  symbol
                                }
                                quoteCurrency {
                                  symbol
                                }
                                quotePrice
                              }
                            }
                          }
                          `
      });

      const result2 = await axios.post("https://graphql.bitquery.io", {
        json: true,
        query: `{
                    ethereum(network: bsc) {
                      dexTrades(
                        options: {desc: ["block.height", "transaction.index"], limit: 1}
                        baseCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
                        quoteCurrency: {is: "0x55d398326f99059ff775485246999027b3197955"}
                      ) {
                        block {
                          height
                          timestamp {
                            time(format: "%Y-%m-%d %H:%M:%S")
                          }
                        }
                        transaction {
                          index
                        }
                        baseCurrency {
                          symbol
                        }
                        quoteCurrency {
                          symbol
                        }
                        quotePrice
                      }
                    }
                  }
                  
                          `
      });
      console.log("result1=======>", result1.data.data.ethereum);
      console.log("result2=======>", result2.data.data.ethereum);
      if (result1.data.data.ethereum.dexTrades == null && result2.data.data.ethereum.dexTrades != null) {
        return res.send({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: { TokenPrice: result2.data.data.ethereum.dexTrades[0].quotePrice } });
      } else if (result1.data.data.ethereum.dexTrades != null && result2.data.data.ethereum.dexTrades == null) {
        return res.send({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: { TokenPrice: result1.data.data.ethereum.dexTrades[0].quotePrice } });
      } else {
        let TokenPrice = result1.data.data.ethereum.dexTrades[0].quotePrice * result2.data.data.ethereum.dexTrades[0].quotePrice;
        console.log("result1=======>", result1.data.data.ethereum.dexTrades[0].quotePrice);
        console.log("result2=======>", result2.data.data.ethereum.dexTrades[0].quotePrice);
        console.log("TokenPrice=======>", TokenPrice);
        return res.send({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: { TokenPrice: TokenPrice } });
      }

    } catch (error) {
      console.log(error)
      return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error });
    }
  },

  inscriptionsList: async (req, res) => {
    try {
      let user = null;
      if (req.headers.token && req.headers.token != "null") {
        let decode = jwt.verify(req.headers.token, 'fullstack_blockchain')
        user = await userModel.findOne({ _id: decode.id });
      }
      const { page, limit, search, status, addedby, fromDate, toDate } = req.query;
      let query = { status: "ACTIVE", active: true };
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
        limit: parseInt(limit) || 100,
        sort: { inscription: 1 }
      }
      let data = await ads.paginate(query, options);
      if (data.docs.length !== 0) {
        for (let c of data.docs) {
          let voteData = await vote.findOne(
            {
              adId: c._id
            }
          );
          if (voteData) {
            c._doc.totalVotes = voteData.voteCount
          }
          else {
            c._doc.totalVotes = 0
          }

          let slots = await slotModel.find({
            inscription: c.inscription,
            status: "ACTIVE"
          }).select("startDate endDate -_id").sort({ startDate: -1 });
          if (slots.length !== 3) {
            c._doc.bookedSlot = slots;
          }
          else {
            c._doc.bookedSlot = slots;
          }
        }
        if (user) {
          for (let v of data.docs) {
            let voteData = await vote.findOne(
              {
                adId: v._id,
                userIds: { $in: [user._id] }
              }
            );
            if (voteData) {
              v._doc.isVote = true;
            }
            else {
              v._doc.isVote = false;
            }
          }
        }
      };
      if (data.docs.length !== 0) {
        let slotData = await slotModel.find({ status: "ACTIVE", suffled: false });
        for (slot of slotData) {
          if (String(slot.startDate) == String(moment().format('YYYY-MM-DD'))) {
            let currentIndex = data.docs.findIndex((item) => item.userTitle === slot.title);
            if (currentIndex > -1) {
              let removedItem = data.docs.splice(currentIndex, 1)[0];
              let newPosition = slot.position;
              data.docs.splice(newPosition - 1, 0, removedItem);
            }
          };
          if (String(slot.endDate) == String(moment().format('YYYY-MM-DD'))) {
            await slotModel.findByIdAndUpdate({ _id: slot._id }, { $set: { suffled: true } })
          };
        };
      };
      return response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND);
    } catch (error) {
      console.log(error)
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  connectWallet: async (req, res) => {
    try {
      let userResult = await userModel.findOne({ walletAddress: req.body.walletAddress, status: { $ne: "DELETE" } });
      if (!userResult) {
        let profilePic = `https://avatars.dicebear.com/api/identicon/${req.body.walletAddress}.svg`
        var result = await userModel.create({ walletAddress: req.body.walletAddress, profilePic: profilePic, status: "ACTIVE" })
        let token = jwt.sign({ id: result._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'fullstack_blockchain', { expiresIn: '24h' });
        let obj = {
          userId: result._id,
          walletAddress: result.walletAddress,
          userType: result.userType,
          token: token,
          status: result.status,
          profilePic: result.profilePic,
        }
        return response(res, SuccessCode.SUCCESS, obj, SuccessMessage.WALLET_CONN);
      }
      else {
        let token = jwt.sign({ id: userResult._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'fullstack_blockchain', { expiresIn: '24h' });
        let obj = {
          userId: userResult._id,
          walletAddress: userResult.walletAddress,
          token: token,
          userType: userResult.userType,
          status: userResult.status,
          profilePic: userResult.profilePic,
        }
        return response(res, SuccessCode.SUCCESS, obj, SuccessMessage.WALLET_CONN);
      }
    } catch (error) {
      console.log("connectWallet", error)
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  profile: async (req, res) => {
    try {
      let user = await userModel.findOne(
        {
          _id: req.userId
        }
      );
      if (!user) {
        return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
      }
      return response(res, SuccessCode.SUCCESS, user, SuccessMessage.DATA_FOUND);
    } catch (error) {
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

    }
  },

  addVotes: async (req, res) => {
    try {
      let user = await userModel.findOne(
        {
          _id: req.userId,
          status: "ACTIVE",
          userType: "USER"
        }
      );
      if (!user) {
        return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
      }
      let ins = await ads.findOne(
        {
          _id: req.params._id,
          status: "ACTIVE",
          active: true
        }
      );
      if (!ins) {
        return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      }
      let voteData = await vote.findOne(
        {
          status: "ACTIVE",
          adId: ins._id
        }
      );
      if (!voteData) {
        let obj = {
          userIds: [user._id],
          adId: ins._id,
          count: ins.inscription,
          voteCount: 1
        }
        let save = await vote.create(obj)
        await userModel.findByIdAndUpdate({ _id: user._id }, { $inc: { ordinalPoints: 1 } })
        return response(res, SuccessCode.SUCCESS, save, SuccessMessage.VOTE_ADD);
      }
      else if (voteData) {
        let check = await vote.findOne(
          {
            _id: voteData._id,
            adId: ins._id,
            userIds: { $in: user._id }
          }
        )
        if (check) {
          return response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.VOTE_ALREADY_EXIST)
        }
        else {
          let data = await vote.findByIdAndUpdate(
            {
              _id: voteData._id
            },
            {
              $push: {
                userIds: user._id
              },
              $inc: {
                voteCount: 1
              }
            },
            {
              new: true
            }
          );
          await userModel.findByIdAndUpdate({ _id: user._id }, { $inc: { ordinalPoints: 1 } })
          return response(res, SuccessCode.SUCCESS, data, SuccessMessage.VOTE_ADD);
        }
      }
    } catch (error) {
      console.log(error)
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  topVotes: async (req, res) => {
    try {
      let data = await vote.find({ status: "ACTIVE" }).populate({ path: "adId" }).sort({ voteCount: -1 }).limit(10);
      return response(res, SuccessCode.SUCCESS, data, SuccessMessage.VOTE_ADD);
    } catch (error) {
      console.log(error)
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },


  buySlot: async (req, res) => {
    try {
      const { inscription, title, url, date, position, info } = req.body;
      let user = await userModel.findOne(
        {
          _id: req.userId,
          status: "ACTIVE",
          userType: "USER"
        }
      );
      if (!user) {
        return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
      };
      let slot = await slotModel.find({
        status: "ACTIVE",
        inscription: inscription
      });
      if (slot.length == 3) {
        return response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.LIMIT_EXCEED);
      };
      let data = await slotModel.create({
        userId: user._id,
        inscription: inscription,
        title: title,
        url: url,
        startDate: moment(date).format("YYYY-MM-DD"),
        endDate: moment(date).format("YYYY-MM-DD"),
        position: position,
        info: info
      });
      return response(res, SuccessCode.SUCCESS, data, SuccessMessage.SLOT);
    } catch (error) {
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  },

  uploadImage: async (req, res) => {
    try {
      var result = await userModel.findOne({ _id: req.userId, userType: "USER" })
      if (!result) {
        return response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
      }
      const file = req.files.file
      let image = await commonFunction.uploadImageNew(file.tempFilePath)
      let obj = {
        name: file.name,
        type: file.mimetype,
        url: image
      };
      const deleteFile = path.resolve(`/${file.tempFilePath}`);
      deletePath(deleteFile);
      return response(res, SuccessCode.SUCCESS, obj, SuccessMessage.UPLOAD_SUCCESS);
    }
    catch (error) {
      console.log("uploadMultipleImage", error)
      return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    }
  }


  //**********************ends of exports**************************/
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