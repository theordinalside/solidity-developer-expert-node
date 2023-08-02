
const cloudinary = require('cloudinary');
const nodemailer = require('nodemailer');
cloudinary.config({
  // cloud_name: "dxpgsnqbw",
  // api_key: "549273191543456",
  // api_secret: "eN8D-qIT_VlPrtuX-kRYCg8zVdw",
  "cloud_name": "duagenpze",
  "api_key": "246126478273115",
  "api_secret": "2Xmlt6jrhDg0K6iTptTSCaBwSyQ"
});


module.exports = {


  uploadImage(img, callback) {
    cloudinary.v2.uploader.upload(img, (err, result) => {
      console.log("302===>>", err, result)
      if (err) {

        callback(err, null)
      }
      else {
        callback(null, result.secure_url)
      }
    });
  },


  multipleImageUploadCloudinary: (imageB64, callback) => {
    let imageArr = []
    async.eachSeries(imageB64, (items, callbackNextiteration) => {
      module.exports.imageUploadCloudinary(items, (err, url) => {
        if (err)
          console.log("error is in line 119", err)
        else {
          imageArr.push(url);
          callbackNextiteration();
        }
      })
    }, (err) => {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhh", imageArr)

      callback(null, imageArr);
    }

    )
  },
  videoUpload(base64, callback) {
    cloudinary.v2.uploader.upload(base64,
      {
        resource_type: "video",
      },
      function (error, result) {
        if (error) {
          callback(error, null)
        }
        else {
          callback(null, result.secure_url)
        }
      });
  },

  qrcodeGenrate: (code, callback) => {

    QRCode.toDataURL(code, function (err, url) {
      if (err) {
        callback(err, null)
      }
      else {
        callback(null, url)
      }
    })
  },

  imageUploadCloudinary: (pic, callback) => {
    cloudinary.v2.uploader.upload(pic, {
      resource_type: "auto"
    }, (error, result) => {
      //console.log("ttttttttttttttttttttttttttttttttt", error, result)
      if (error) {
        callback(error, null)
      }
      else {
        callback(null, result.secure_url)
      }
    })
  },

  sendLink: (email, firstName, _id, callback) => {

    let html = `<html lang="en"><head>
  
                      <meta charset="utf-8">
                      <meta http-equiv="X-UA-Compatible" content="IE=edge">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <meta name="description" content="">
                      <meta name="author" content="">
                    
                      <title></title>
                  
                  </head>
                  <body style="margin: 0px; padding: 0px;">
                    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                  
                          <table style="width:600px;margin:0px auto;background:#E7E71D;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
                              <tbody>
                          <tr>
                            <td style='font-size: 16px;text-align:center;' >
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
                              <tbody>
                              <tr style="background-color:#EB230F; text-align:left;">
                                <td style="font-size:16px;text-align:left;">  
                                  <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
                                    <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1574933062/bvld7yaitliwvf3ciips.png" style="padding: 0px;margin: 0px; width="100" height="100"">
                                  </span>
                                </td>                                   
                              </tr>               
                            </tbody>
                              </table>
                              
                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
                                <tbody>
                                  <tr>
                                           <td  style="text-align: center;     padding: 16px 0px;">
                                                        <div style="color:#437EF2;font-size:25px;margin-bottom:5px;">WELCOME TO FULLSTACK BLOCKCHAIN NEEDED</div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center; padding: 10px 0px;">
                                                        <div style="color:#F24358;font-size:20px;margin-bottom:5px;font-weight: 200;"> Dear ${firstName}<p>Please click on the link for reset password.<a href = '${global.gConfig.url}/${_id}'><button> Click here </button></a></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;">
                                                        <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
                                    </td> 
                                      </tr>
                                      <tr>
                                           <td  style="text-align: center;    padding: 20px 0px;">
                                                        
                                    </td> 
                                      </tr>                 
                                </tbody>
                              </table>
                  
                            </table>
                          </div>
                      
                    </body>
                    </html>`

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": global.gConfig.nodemailer.user,
        "pass": global.gConfig.nodemailer.pass

      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: 'FullStack BlockChain',
      //text: text,
      html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        callback(error, null)
      } else {
        callback(null, info.response)
      }
    });

  },

  async uploadImageNew(img) {
    const result = await cloudinary.v2.uploader.upload(img);
    return result.secure_url;
  }

}
