
const axios = require('axios');
const ethers = require('ethers');
const web3 = require('web3');
const services = require('../service/services');
var responses;

const totalSupply = async (tokenAddress) => {
    try {
        let supply = await axios.get(`${services.bscapiurl}api?module=stats&action=tokensupply&contractaddress=${tokenAddress}&apikey=${services.apitokenkey}`)
        // https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${tokenAddress}&apikey=SSH6VTXMSSZV4XFZYXF38VTUHJSCYV9T86
        return supply.data.result
    }
    catch (error) {

        return error
    }
}

const tokenBnbLpBnbHolding = async (tokenAddress) => {
    try {
        balance = await axios.get(`https://api.pancakeswap.info/api/tokens/${tokenAddress}`)
        // console.log("22======balance=====>>", balance.data.data[tokenAddress])
        let value = {
            price: balance.data.data.price,
            name: balance.data.data.name,
            symbol: balance.data.data.symbol,
        }
        return value

    }
    catch (error) {

        return error
    }
}
const tokenBnbLpBnbHoldingV2 = async (tokenAddress) => {
    try {
        balance = await axios.get(`https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`)
        console.log("44======balance=====>>", balance.data.data[tokenAddress])
        let value = {
            price: balance.data.data.price,
            name: balance.data.data.name,
            symbol: balance.data.data.symbol,
        }
        console.log("46=============>>>", value)
        return value

    }
    catch (error) {

        return error
    }
}

const getPairAddress = async (tokenAddress) => {
    try {
        tokenAddress = web3.utils.toChecksumAddress(tokenAddress);
        balance = await axios.get(`https://api.pancakeswap.info/api/pairs`)
        // console.log("42======balance=====>>", balance.data.data)
        // const objData = balance.data.data;
        // const newArrey = Object.keys(objData).map((item) => {
        //     return objData[item];
        // });
        // console.log("47====>>",newArrey)
        // const pairAddress = newArrey.filter((item) => {
        //     return item.base_address === tokenAddress
        // })
        // console.log("44==>>",pairAddress, pairAddress[0])

        var a = `${tokenAddress}_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`;
        var b = `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_${tokenAddress}`;
        var pair_address;
        // console.log("82====>>",balance.data.data)
        // console.log("57==>>", tokenAddress, a, b, balance.data.data[a], balance.data.data[b])
        if (balance.data.data[a] !== undefined) {
            pair_address = balance.data.data[a].pair_address;
        } else if (balance.data.data[b] !== undefined) {
            pair_address = balance.data.data[b].pair_address;
        } else {
            pair_address = 0
        }
        return pair_address
    }
    catch (error) {

        return error
    }
}

const getPairAddressV2 = async (tokenAddress) => {
    try {
        tokenAddress = web3.utils.toChecksumAddress(tokenAddress);
        balance = await axios.get(`https://api.pancakeswap.info/api/v2/pairs`)
        // console.log("42======balance=====>>", balance.data.data)
        // const objData = balance.data.data;
        // const newArrey = Object.keys(objData).map((item) => {
        //     return objData[item];
        // });
        // console.log("47====>>",newArrey)
        // const pairAddress = newArrey.filter((item) => {
        //     return item.base_address === tokenAddress
        // })
        // console.log("44==>>",pairAddress, pairAddress[0])

        var a = `${tokenAddress}_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`;
        var b = `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_${tokenAddress}`;
        var pair_address;
        // console.log("82====>>",balance.data.data)
        // console.log("57==>>", tokenAddress, a, b, balance.data.data[a], balance.data.data[b])
        if (balance.data.data[a] !== undefined) {
            pair_address = balance.data.data[a].pair_address;
        } else if (balance.data.data[b] !== undefined) {
            pair_address = balance.data.data[b].pair_address;
        } else {
            pair_address = 0
        }
        return pair_address
    }
    catch (error) {

        return error
    }
}




const marketPrice = async () => {
    try {
        let MarketCap = totalSupply() * tokenBnbLpBnbHolding();

        console.log();
        return MarketCap
    }
    catch (error) {

        return error
    }
}



const lpBnbHoldingBalance = async (tokenAddress) => {
    try {
        tokenAddress = web3.utils.toChecksumAddress(tokenAddress);
        var a = `${tokenAddress}_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`;
        var b = `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_${tokenAddress}`;
        let balance = await axios.get('https://api.pancakeswap.info/api/summary')
        // console.log("78===>>", balance.data.data)
        var pri;
        // console.log("82====>>",balance.data.data)
        console.log("83==>>", tokenAddress, a, b, balance.data.data[a], balance.data.data[b])
        if (balance.data.data[a] !== undefined) {
            pri = balance.data.data[a].liquidity_BNB;
        } else if (balance.data.data[b] !== undefined) {
            pri = balance.data.data[b].liquidity_BNB;
        } else {
            pri = 0
        }
        console.log("92===>>", pri)
        return pri / 2
    }
    catch (error) {

        return error
    }
}

const lpBnbHoldingBalanceV2 = async (tokenAddress) => {
    try {
        tokenAddress = web3.utils.toChecksumAddress(tokenAddress);
        var a = `${tokenAddress}_0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`;
        var b = `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_${tokenAddress}`;
        let balance = await axios.get('https://api.pancakeswap.info/api/v2/summary')
        // console.log("78===>>", balance.data.data)
        var pri;
        // console.log("82====>>",balance.data.data)
        console.log("83==>>", tokenAddress, a, b, balance.data.data[a], balance.data.data[b])
        if (balance.data.data[a] !== undefined) {
            pri = balance.data.data[a].liquidity_BNB;
        } else if (balance.data.data[b] !== undefined) {
            pri = balance.data.data[b].liquidity_BNB;
        } else {
            pri = 0
        }
        pri = parseInt(pri)
        console.log("92===>>", pri)
        return pri / 2
    }
    catch (error) {

        return error
    }
}


const lpBnbHoldingPrice = async () => {
    try {
        let price = await axios.get("https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=1Z7C9THKDCM6XQN42U8P9C4VXTXRPTCBP6")
        console.log("200=====>>", price.data.result)
        let wbnbPrice = parseInt(price.data.result.ethusd)
        // let result0 = await lpBnbHoldingBalance(`${req.query.tokenAddress}_${services.pairApi}`)
        // let holdingPrice= wbnbPrice*result0;
        return wbnbPrice

    }
    catch (error) {
        return error
    }

}




module.exports = {

    allApi: async (req, res) => {
        try {
            const result1 = await totalSupply()//totalSupply convert into ether
            let result2 = await tokenBnbLpBnbHolding(tokenAddress)//tokenPrice
            result1 = ethers.utils.formatEther(result1);
            let result3 = result1 * result2//marketCap
            let result4 = await lpBnbHoldingBalance(`${tokenAddress}_${services.pairApi}`)//lpBnbHolding
            let result5 = await lpBnbHoldingPrice()//lpBnbPrice
            let result6 = result4 * result5
            var [results1, results2, results3, results4, results6] = await Promise.all([result1, result2, result3, result4, result6]);
            console.log("117===>>", [results1, results2, results3, results4, results6])
            res.status(200).json({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: [results1, results2, results3, results4, results6] })

        }
        catch (error) {

            console.log(error)
            return res.status(501).json({ responseCode: 501, responseMessage: `Falied to Submit Transaction ${error}` })
        }
    },


    allApiSocket: async (tokenAddress) => {
        try {
            console.log("Line no 113======>>>>", tokenAddress)
            return new Promise(async (resolve, reject) => {
                let result1 = await totalSupply(tokenAddress)//totalSupply convert into ether
                console.log("result1===>>", result1)
                let result2 = await tokenBnbLpBnbHolding(tokenAddress)//tokenPrice
                let valueInEther = ethers.utils.formatEther(result1);
                let result3 = valueInEther * result2.price//marketCap
                let result4 = await lpBnbHoldingBalance(`${tokenAddress}`)//lpBnbHolding
                let result5 = await lpBnbHoldingPrice()
                let result6 = result4 * result5;
                let result7 = await getPairAddress(tokenAddress);
                var [results1, results2, results3, results4, results6] = await Promise.all([result1, result2, result3, result4, result6]);
                console.log("117===>>", [results1, results2, results3, results4, results6])
                const finalData = {
                    totalSupply: valueInEther,
                    tokenData: result2,
                    MarketCap: result3,
                    lpBnbHolding: result4,
                    lpBnbHoldingPrice: result6,
                    pairAddress: result7
                }
                console.log("finalData===>>", finalData)
                responses = ({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: finalData });
                resolve(responses)

            })
        } catch (error) {
            responses = ({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error });
            resolve(responses)
        }
    },

    allApiSocketV2: async (tokenAddress) => {
        try {
            console.log("Line no 280======>>>>", tokenAddress)
            return new Promise(async (resolve, reject) => {
                let result1 = await totalSupply(tokenAddress)//totalSupply convert into ether
                // console.log("result1===>>", result1)
                let result2 = await tokenBnbLpBnbHoldingV2(tokenAddress)//tokenPrice
                // console.log("285=======>>",result2);
                let result4 = await lpBnbHoldingBalanceV2(`${tokenAddress}`)//lpBnbHolding
                let result5 = await lpBnbHoldingPrice()
                let result6 = result4 * result5;
                let result7 = await getPairAddressV2(tokenAddress);
                var [results1, results2, results4, results6, results7] = await Promise.all([result1, result2, result4, result6, result7]);
                let valueInEther = ethers.utils.formatEther(results1);
                // results2.price = results2.price
                console.log("291======>>", results2.price, valueInEther, typeof (results2.price))
                let results3 = valueInEther * results2.price //marketCap
                console.log("297===>>", results3)
                const finalData = {
                    totalSupply: valueInEther,
                    tokenData: results2,
                    MarketCap: results3,
                    lpBnbHolding: results4,
                    lpBnbHoldingPrice: results6,
                    pairAddress: results7
                }
                // if (finalData.lpBnbHolding !== null && finalData.lpBnbHoldingPrice !== null && finalData.MarketCap != 0) {
                console.log("finalData===>>", finalData)
                responses = ({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: finalData });
                resolve(responses)
                // }


            })
        } catch (error) {
            responses = ({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error });
            resolve(responses)
        }
    },


    getDataWithContact: async (contractAddress) => {
        try {
            console.log("Line no 113======>>>>", contractAddress)
            return new Promise(async (resolve, reject) => {
                let pair = await getPairAddress(contractAddress);
                console.log("pair======>>>>", pair)
                try {
                    const bnbDataV1 = await axios.get('https://api.pancakeswap.info/api/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
                    const bnbDataV2 = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
                    const res = await axios.post("https://graphql.bitquery.io", {
                        query: `query ($network: EthereumNetwork!, $limit: Int!) {
                            ethereum(network: $network) {
                              dexTrades(
                                options: {limit: $limit, desc: "block.height"}
                                exchangeAddress: {in: ["0xca143ce32fe78f1f7019d7d551a6402fc5350c73", "0xbcfccbde45ce874adcb698cc183debcf17952812"]}
                                baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
                                quoteCurrency: {is: "${contractAddress}"}
                              ) {
                                transaction {
                                  hash
                                  txFrom {
                                    address
                                  }
                                  to {
                                    address
                                  }
                                }
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
                                date {
                                  date
                                }
                                block {
                                  height
                                  timestamp {
                                    time
                                  }
                                }
                                buyAmount
                                buyAmountInUsd: buyAmount(in: USD)
                                buyCurrency {
                                  symbol
                                  address
                                }
                                sellAmount
                                sellAmountInUsd: sellAmount(in: USD)
                                sellCurrency {
                                  symbol
                                  address
                                }
                                sellAmountInUsd: sellAmount(in: USD)
                                tradeAmount(in: USD)
                                transaction {
                                  hash
                                  txFrom {
                                    address
                                  }
                                  to {
                                    address
                                  }
                                }
                                taker {
                                  address
                                }
                                maker {
                                  address
                                }
                                exchange {
                                  address {
                                    address
                                  }
                                }
                              }
                            }
                          }
                          `,
                        variables: {
                            network: "bsc",
                            limit: 50,
                        },
                    });
                    console.log("Poocoin Res ===>", res.data.data.ethereum.dexTrades);
                    responses = ({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: { transactions: res.data.data.ethereum.dexTrades, bnbDataV1: bnbDataV1.data.data, bnbDataV2: bnbDataV2.data.data } });
                    resolve(responses)
                } catch (e) {
                    responses = ({ responseCode: 403, responseMessage: "Request failed with status code 403!", responseResult: e });
                    resolve(responses)
                }
            })
        } catch (error) {
            responses = ({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error });
            resolve(responses)
        }
    },


  
    // getDataWithContact: async (contractAddress) => {
    //     try {
    //         console.log("Line no 113======>>>>", contractAddress)
    //         return new Promise(async (resolve, reject) => {
    //             const resultdata = await axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=20&sort=desc&apikey=13QG8WB4HIGMBHVN8ZGQZRN896ZGXCY5QJ`)
    //             //    console.log("176====>>>",resultdata.data.result) 
    //             responses = ({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: resultdata.data.result });
    //             resolve(responses)

    //         })
    //     } catch (error) {
    //         responses = ({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error });
    //         resolve(responses)
    //     }
    // },



}



















// let result4 = await lpBnbHoldingBalance(`${req.query.tokenAddress}_${services.pairApi}`)


