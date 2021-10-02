var express = require('express'),
  bodyParser = require('body-parser'),
  url = 'mongodb://halpingHands:HalpingIsGood@13.235.148.218:53584/helpinghands';
  dbName = 'helpinghands',
  MongoClient = require('mongodb').MongoClient,
  objectId = require('mongodb').ObjectID,
  assets = require('assert'),
  uniqid = require('randomatic'),
  _req = require('request'),
  app = express(),
  helmet = require('helmet'),
  verson = 'v1',
  port = '3000';

var otpJson = []
var BaseUrl = "http://13.235.148.218:" + port + "/v1";
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var multer = require('multer')
var upload = multer()

var server = app.listen(port, () => {
  console.log("We Are Live On " + port)
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  assets.equal(null, err);
  if (err) throw err;
  const db = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)











app.post('/' + verson + '/createOTP', (req, res) => {

    var data = req.body
    var otp = uniqid('0', 6);
    otpJson[data.Mobile_no] = otp
    
    var link;
    link="http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=SUMIT@12&mobile=" + data.Mobile_no + "&text=Welcome to Global Money, Your OTP is " + otp + " to verify your account on Global Money.&senderid=SSVLTE&route_id=1&Unicode=0";
     _req({
        "url": link,
        "json": true,
        "method": "get"
    }, (err, httpResponse, body) => {

      res.send({error: false, msg: `opt send successfully to this Mobile Number ${data.Mobile_no}`})

    })
});



app.post('/' + verson + '/verifyOTP', (req, res) => {
  var data = req.body
  if (otpJson[data.Mobile_no] == data.otp) {
      res.send({ error: false });
      delete otpJson[data.Mobile_no]
  }
  else {
    res.send({ error: true });
  }
})












  app.post('/' + verson + '/login', (req, res) => {

    var data = req.body;
    var Mobile_no = data.Mobile_no;
    var password = data.password;

    if (Mobile_no && password) {

      db.collection('register').findOne({ Mobile_no: Mobile_no }, (err, result) => {

        if (err) {
          console.log(err);
        }

        if (result) {
          bcrypt.compare(password, result.password, function (err, trueres) {
            if (trueres == true) {

              var datas = {
                User_id: result._id,
                name: result.name,
                Mobile_no: result.Mobile_no,
                city: result.city,
                my_referid: result.my_referid,
                date: result.date
              }

              datas = result.block != 1 ? datas : {}
              var error = result.block != 1 ? true : false


              return res.send({ error: false, data: datas, block: result.block });
            } else {
              return res.send({ data: {}, error: true, block: 0 });
            }
          })

        } else {
          return res.send({ data: {}, error: true, block: 0 });
        }

      })
    } else {
      return res.send({ data: {}, error: true, block: 0 });
    }
  })











  app.post('/' + verson + '/Forgot', (req, res) => {
    var data = req.body;

    var query = {
      Mobile_no: data.Mobile_no
    }

    db.collection('register').findOne(query, (err, findid) => {
      if (findid) {
        if (findid.block == 1) {
          return res.send({ error: true, msg: 'User Blocked' })
        }
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(data.new_pass, salt, (err, hash) => {
          var updatedata = { $set: { password: hash } }
          db.collection('register').updateOne(query, updatedata, (err, result) => {
            return res.send({ error: false })
          })
        })
      })
      } else {
        return res.send({ error: true, msg: 'User Not Found' })
      }
    })
  })








  app.post('/' + verson + '/register', (req, res) => {
    var data = req.body;

    if (data.sender_referid != '') {
      if (data.name != '' || data.Mobile_no != '' || data.password != '' || data.city != '') {
        db.collection('register').countDocuments({ my_referid: data.sender_referid }, (err, result1) => {
          if (result1 == 0) {
            return res.send({ error: true, msg: '1', data: {} })
          } else {
            bcrypt.genSalt(saltRounds, (err, salt) => {
              bcrypt.hash(data.password, salt, (err, hash) => {
                var currentTime = new Date()
                currentTime.setUTCHours(currentTime.getHours() + 5);
                currentTime.setUTCMinutes(currentTime.getMinutes() + 30);
                var register = {
                  name: data.name,
                  sender_referid: data.sender_referid,
                  Mobile_no: data.Mobile_no,
                  password: hash,
                  city: data.city,
                  walletBalance: 0,
                  my_referid: uniqid('A0', 8),
                  block: 0,
                  date: currentTime
                }

                db.collection('register').findOne({ Mobile_no: data.Mobile_no }, (err, result) => {
                  if (result) {
                    return res.send({ error: true, msg: '2', data: {} })
                  } else {
                    db.collection('register').insertOne(register, (errs, response) => {
                      if (errs) {
                        return res.send({ error: true, data: {} });
                      }
                      var regsus = { name: data.name, Mobile_no: data.Mobile_no, walletBalance: 0, city: data.city, my_referid: data.my_referid }
                      return res.send({ error: false, msg: 0, data: regsus })
                    })
                  }
                })
              })
            })
          }
        })
      } else {
        return res.send({ error: true, data: {} })
      }
    } else {
      return res.send({ error: true, data: {} })
    }

  })










  app.post('/' + verson + '/User_Dashboard', upload.any(), (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
      if (validuser != undefined || validuser != null) {
        if (validuser.block == 1) {
          return res.send({ error: true, data: {} })
        }
        db.collection('phrh').countDocuments({ sender_id: objectId(data.User_id) }, (err2, ph_link) => {
          db.collection('phrh').countDocuments({ receiver_id: objectId(data.User_id) }, (err3, rh_link) => {
            db.collection('register').countDocuments({ sender_referid: validuser.my_referid }, (err4, team) => {
              // db.collection('pinHistory').find({User_id: data.User_id}).toArray((err5, sumofamount) => {

              // var sum = 0;
              // for(var i = 0; i < sumofamount.length; i++){
              //   sum += parseInt(sumofamount[i].pin_count);
              // }
              var currentTime = new Date()
              currentTime.setUTCHours(currentTime.getHours() + 5);
              currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

              var datass = {
                User_ID: data.User_id,
                name: validuser.name,
                mobile_no: validuser.mobile_no,
                // User_total_pin: sum,
                Total_ph: ph_link,
                Total_rh: rh_link,
                team: team,
                Wallet_balance: validuser.walletBalance,
                date: currentTime
              }
              return res.send({ error: false, data: datass })
            })
            //  })         
          })
        })
      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })









  app.post('/' + verson + '/Pin_buy', (req, res) => {

    var data = req.body;

    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

      if (validuser != undefined || validuser != null) {
        if (validuser.block == 1) {
          return res.send({ error: true, data: {} })
        }
        db.collection('todaypin').findOne({ visible: 0 }, (err2, result) => {

          if (result != undefined || result != null) {

            if (!(data.pin_count > result.available_pin)) { // less then or equal to not working
              if (!(data.amount > validuser.walletBalance)) {

                if (isNaN(data.amount)) {
                  return res.send({ error: true, data: {} })
                } else {
                  if (data.amount == '' || data.amount == 0) {
                    return res.send({ error: true, data: {} })
                  } else {
                    var mybal = parseInt(data.amount)
                  }
                }

                if (isNaN(data.pin_count)) {
                  return res.send({ error: true, data: {} })
                } else {
                  if (data.pin_count == '' || data.pin_count == 0) {
                    return res.send({ error: true, data: {} })
                  } else {
                    var mypins = parseInt(data.pin_count)
                  }
                }


                var currentTime = new Date()
                currentTime.setUTCHours(currentTime.getHours() + 5);
                currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

                db.collection('pinHistory').find({ User_id: objectId(data.User_id) }).toArray((err6, ifpinexist) => {
                  db.collection('todaypin').findOne({ visible: 0 }, (err9, mypin) => {
                    var insert = {
                      User_id: objectId(data.User_id),
                      amount: mybal,
                      pin_count: mypins,
                      use: 0,
                      makeReceiver:0,
                      pin_id: mypin.pin_uniqid,
                      Tr_id: uniqid('Aa0', 12),
                      date: currentTime
                    }
                    db.collection('pinHistory').insertOne(insert, (err3, pinHistory) => {
                      db.collection('todaypin').updateOne({ visible: 0 }, { $inc: { available_pin: -mypins, sold_pin: +mypins } }, (err4, available_pin) => {
                        db.collection('pinHistory').find({ User_id: objectId(data.User_id) }).toArray((err6, sumofamount) => {
                          db.collection('register').updateOne({ _id: objectId(data.User_id) }, { $inc: { walletBalance: -mybal } }, (err7, mycall) => {
                            db.collection('register').findOne({ _id: objectId(data.User_id) }, (err8, latestamount) => {
                             db.collection('todaypin').findOne({ visible: 0 }, (err9, updatedpin) => {
                             /*if (typeof ifpinexist[0] == 'undefined') {
                                var currentTimes = new Date()
                                currentTimes.setUTCHours(currentTimes.getHours() + 5);
                                currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
                                var ph_rh = {
                                  sender_id: objectId(data.User_id),
                                  receiver_id: objectId('5f9152ea2077887163bf3db6'),
                                  pin_amount: parseInt(mypin.pin_amount),
                                  provider_amt: parseInt(mypin.provider_amt),
                                  receiver_amt: parseInt(mypin.receiver_amt),
                                  use: 0,
                                  Tr_id: uniqid('Aa0', 12),
                                  date: currentTimes
                                }
                                db.collection('phrh').insertOne(ph_rh)
                                db.collection('pinHistory').updateOne({ User_id: objectId(data.User_id) }, { $set: { use: 1 } })
                              }*/

                              var sum = 0;
                              for (var i = 0; i < sumofamount.length; i++) {
                                sum += parseInt(sumofamount[i].pin_count);
                              }

                              var datass = {
                                user_total_pin: sum,
                                total_pin: updatedpin.total_pin,
                                sold_pin: updatedpin.sold_pin,
                                available_pin: updatedpin.available_pin,
                                walletBalance: latestamount.walletBalance,
                                date: currentTime
                              }

                              return res.send({ error: false, data: datass })
                            })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              } else {
                return res.send({ error: true, data: {} })
              }

            } else {
              return res.send({ error: true, data: {} })
            }

          } else {
            return res.send({ error: true, data: {} })
          }
        })

      } else {
        return res.send({ error: true, data: {} })
      }

    })
  })














  app.post('/' + verson + '/confirm_amount', (req, res) => {

    var data = req.body;

    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    if (!objectId.isValid(data.Tr_user_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('phrh').findOne({ Tr_id: data.TR_ID }, (err, result) => {

      if (result != undefined || result != null) {

        if (result.use != 1) {

          if ((result.sender_id).toString() == (data.Tr_user_id).toString()) {

            if ((result.receiver_id).toString() == (data.User_id).toString()) {

              if (isNaN(data.amount)) {
                return res.send({ error: true, data: {} })
              } else {
                if (data.amount == '' || data.amount == 0) {
                  return res.send({ error: true, data: {} })
                } else {
                  var mybal = parseInt(data.amount)
                }
              }

              db.collection('register').findOne({ _id: objectId(data.User_id) }, (err3, updatedamount) => {
                if (updatedamount.block == 1) {
                  return res.send({ error: true, data: {} })
                }
                var currentTime = new Date()
              currentTime.setUTCHours(currentTime.getHours() + 5);
              currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

                db.collection('phrh').updateOne({ Tr_id: data.TR_ID }, { $set: { use: 1, tranferdate: currentTime } }, (err1, updateuse) => {
                  //             db.collection('register').updateOne({ _id: objectId(data.User_id) }, { $inc: { walletBalance: +mybal } }, (err2, myrealamount) => {
                  //               db.collection('register').findOne({ _id: objectId(data.User_id) }, (err3, updatedamount) => {

                  return res.send({ error: false, user_wallet: updatedamount.walletBalance })
                  //    })
                  //             })
                })

              })
            } else {
              return res.send({ error: true, data: {} })
            }

          } else {
            return res.send({ error: true, data: {} })
          }

        } else {
          return res.send({ error: true, data: {} })
        }

      } else {
        return res.send({ error: true, data: {} })
      }

    })
  })











/*  app.post('/' + verson + '/User_wallet_transfer', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    if (!objectId.isValid(data.receiver_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
      if (validuser.block == 1) {
        return res.send({ error: true, data: {} })
      }
      db.collection('register').findOne({ _id: objectId(data.receiver_id) }, (err1, receiver) => {


        if (validuser != undefined || validuser != null) {
          if (receiver != undefined || receiver != null) {
            if (!(parseInt(data.amount) > validuser.walletBalance)) {


              var currentTime = new Date()
              currentTime.setUTCHours(currentTime.getHours() + 5);
              currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

              var insertdata = {
                serder_id: data.User_id,
                amount: parseInt(data.amount),
                receiver_id: data.receiver_id,
                Tr_id: uniqid('Aa0', 12),
                date: currentTime
              }

              db.collection('walletTransfer').insertOne(insertdata, (err2, result) => {
                db.collection('register').updateOne({ _id: objectId(data.User_id) }, { $inc: { walletBalance: -parseInt(data.amount) } }, (err3, mybalancedown) => {
                  db.collection('register').updateOne({ _id: objectId(data.receiver_id) }, { $inc: { walletBalance: +parseInt(data.amount) } }, (err3, mybalanceup) => {
                    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, mybalance) => {
                      return res.send({ error: false, Wallet_balance: mybalance.walletBalance })
                    })
                  })
                })
              })
            } else {
              return res.send({ error: true, data: {} })
            }

          } else {
            return res.send({ error: true, data: {} })
          }
        } else {
          return res.send({ error: true, data: {} })
        }

      })
    })

  })*/


app.post('/' + verson + '/User_wallet_transfer', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
      if (validuser.block == 1) {
        return res.send({ error: true, data: {} })
      }
      db.collection('register').findOne({ Mobile_no: data.Mobile_no }, (err1, receiver) => {
        

       if (typeof validuser != 'undefined') {
         if (typeof receiver != 'undefined') {
           if (validuser.Mobile_no != receiver.Mobile_no) {
            if (isNaN(data.amount)) {
              return res.send({ error: true, data: {} })
            } else {
              if (data.amount == '' || data.amount == 0) {
                return res.send({ error: true, data: {} })
              } else {
                var mybal = parseInt(data.amount)
              }
            }
            if (!(mybal > validuser.walletBalance)) {
              


              var currentTime = new Date()
              currentTime.setUTCHours(currentTime.getHours() + 5);
              currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

              var insertdata = {
                sender_id: objectId(data.User_id),
                receiver_id: objectId(receiver._id),
                amount: mybal,
                Tr_id: uniqid('Aa0', 12),
                date: currentTime
              }

              db.collection('walletTransfer').insertOne(insertdata, (err2, result) => {
                db.collection('register').updateOne({ _id: objectId(data.User_id) }, { $inc: { walletBalance: -mybal } }, (err3, mybalancedown) => {
                  db.collection('register').updateOne({ Mobile_no: data.Mobile_no }, { $inc: { walletBalance: +mybal } }, (err3, mybalanceup) => {
                    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, mybalance) => {
                      return res.send({ error: false, Wallet_balance: mybalance.walletBalance })
                    })
                  })
                })
              })
            } else {
              return res.send({ error: true,res: 2 })
            }
          } else {
            return res.send({ error: true, res: 3 })
          }
          } else {
            return res.send({ error: true,res: 1 })
          }
        } else {
          return res.send({ error: true, data: {} })
        }

      })
    })

  })









  app.post('/' + verson + '/User_history', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

      if (validuser.block == 1) {
        return res.send({ error: true, data: {} })
      }
      if (validuser != undefined || validuser != null) {

        db.collection('phrh').find({ sender_id: objectId(data.User_id) }).toArray((err2, ph_link) => {
          db.collection('phrh').find({ receiver_id: objectId(data.User_id) }).toArray((err3, rh_link) => {
            db.collection('pinHistory').find({ User_id: objectId(data.User_id) }).toArray((err4, pinHistory) => {
              db.collection('walletTransfer').find({ User_id: data.User_id }).toArray((err5, walletTransfer) => {

                var data = {
                  User_id: validuser._id,
                  Total_ph: ph_link,
                  Total_rh: rh_link,
                  pinHistory: pinHistory,
                  moneyTransfer: walletTransfer
                }

                return res.send({ error: false, data: data })
              })
            })
          })
        })

      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })







  app.post('/' + verson + '/add_balance', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

      if (validuser != undefined || validuser != null) {

        if (validuser.block == 1) {
          return res.send({ error: true, data: {} })
        }

        var currentTime = new Date()
        currentTime.setUTCHours(currentTime.getHours() + 5);
        currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

        if (isNaN(data.amount)) {
          return res.send({ error: true, data: {} })
        } else {
          if (data.amount == '' || data.amount == 0) {
            return res.send({ error: true, data: {} })
          } else {
            var mybal = parseInt(data.amount)
          }
        }

        var insert = {
          User_id: objectId(data.User_id),
          amount: mybal,
          addby: 0,
          tr_id: uniqid('Aa0', 12),
          date: currentTime
        }

        db.collection('walletHistory').insertOne(insert, (err2, result) => {
          db.collection('register').findOneAndUpdate({ _id: objectId(data.User_id) }, { $inc: { walletBalance: +mybal } }, (err3, Incamount) => {
            db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, myamount) => {
              var mydata = {
                User_id: myamount._id,
                walletBalance: myamount.walletBalance
              }
              return res.send({ error: false, data: mydata })
            })
          })
        })

      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })








  app.post('/' + verson + '/Wallet', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

      if (validuser != undefined || validuser != null) {

        if (validuser.block == 1) {
          return res.send({ error: true, data: {} })
        }
        var mydata = {
          User_id: validuser._id,
          walletBalance: validuser.walletBalance
        }
        return res.send({ error: false, data: mydata })

      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })








  app.post('/' + verson + '/user_profile', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

      if (validuser != undefined || validuser != null) {

        if (validuser.block == 1) {
          return res.send({ error: true, data: {} })
        }
        if (validuser.sender_referid == null) {
          sender_referid = '';
        }
        var myres = {
          name: validuser.name,
          Mobile_no: validuser.Mobile_no,
          city: validuser.city,
          my_referid: validuser.my_referid,
          walletBalance: validuser.walletBalance,
          block: validuser.block
        }
        return res.send({ error: false, data: myres })

      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })










/*  app.get('/' + verson + '/todayPin', (req, res) => {
    db.collection('todaypin').findOne({ visible: 0 }, (err1, validuser) => {
      if (validuser == null) {
        db.collection('todaypin').findOne({ visible: 2 }, (err1, mypinn) => {
          if (mypinn == null) {
            mypinn = {}
            return res.send({ error: true, mymili: 0, data: mypinn })
          } else {

            var currentTime = new Date()
            currentTime.setUTCHours(currentTime.getHours() + 5);
            currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

            var end = mypinn.starttime;

            var milisec = (end - currentTime)

            return res.send({ error: false, mymili: milisec, data: mypinn })

          }
        })
      } else {

        var currentTime = new Date()
        currentTime.setUTCHours(currentTime.getHours() + 5);
        currentTime.setUTCMinutes(currentTime.getMinutes() + 30);

        var end = validuser.endtime;

        var milisec = (end - currentTime)

        return res.send({ error: false, mymili: milisec, data: validuser })
      }
    })
  })*/



app.post('/' + verson + '/todayPin', (req, res) => {
    db.collection('todaypin').findOne({ visible: 0 }, (err1, validuser) => {
      if (validuser == null) {
        db.collection('register').findOne({ _id: objectId(req.body.User_id) }, (err2, userwallet) => {

          if (userwallet) {
            db.collection('todaypin').findOne({ visible: 2 }, (err3, mypinn) => {
              if (mypinn == null) {
                mypinn = {}
                return res.send({ error: true,Uwallet: userwallet.walletBalance, mymili: 0, data: mypinn })
              } else {
                var currentTime = new Date()
                currentTime.setUTCHours(currentTime.getHours() + 5);
                currentTime.setUTCMinutes(currentTime.getMinutes() + 30);
                var end = mypinn.starttime;
                var milisec = (end - currentTime)
                return res.send({ error: false, Uwallet: userwallet.walletBalance, mymili: milisec, data: mypinn })
              }
            })
          } else {
            return res.send({ error: true, data: {} })
          }
        })
      } else {

        db.collection('register').findOne({ _id: objectId(req.body.User_id) }, (err2, userwallet) => {

          if (userwallet) {
            var currentTime = new Date()
            currentTime.setUTCHours(currentTime.getHours() + 5);
            currentTime.setUTCMinutes(currentTime.getMinutes() + 30);
            var end = validuser.endtime;
            var milisec = (end - currentTime)

            return res.send({ error: false, Uwallet: userwallet.walletBalance, mymili: milisec, data: validuser })
          } else {
            return res.send({ error: true, data: {} })
          }
        })
      }
    })
  })








  app.get('/' + verson + '/sharedata', (req, res) => {
    db.collection('sharedata').find({}).sort({ _id: -1 }).limit(1).toArray((err, result) => {
      //   res.send(result[0])
      if (result[0] != undefined) {
        res.send({ error: false, data: result[0] })
      } else {
        res.send({ error: true, data: {} })
      }
    })
  })










  app.post('/' + verson + '/ph_history', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('walletTransfer').find({ User_id: data.User_id }).sort({ _id: -1 }).toArray((err4, ph_history) => {

      if (ph_history != undefined || ph_history != null) {
        return res.send({ error: false, data: ph_history })
      } else {
        return res.send({ error: true, data: {} })
      }

    })

  })



  app.post('/' + verson + '/rh_history', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('walletTransfer').find({ receiver_id: data.User_id }).sort({ _id: -1 }).toArray((err4, rh_history) => {

      if (rh_history != undefined || rh_history != null) {
        return res.send({ error: false, data: rh_history })
      } else {
        return res.send({ error: true, data: {} })
      }

    })

  })







  app.post('/' + verson + '/user_wallet_history', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('walletHistory').find({ User_id: objectId(data.User_id) }).sort({ _id: -1 }).toArray((err4, wallet_history) => {

      if (wallet_history != undefined || wallet_history != null) {

        return res.send({ error: false, data: wallet_history })
      } else {
        return res.send({ error: true, data: {} })
      }

    })

  })





  app.post('/' + verson + '/myTeam', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err4, myreferid) => {

      if (myreferid != undefined || myreferid != null) {
        if (myreferid.block == 1) {
          return res.send({ error: true, data: {} })
        }
        db.collection('register').find({ sender_referid: myreferid.my_referid }).sort({ _id: -1 }).toArray((err3, myteam) => {
          var teamdata = []
          for (var i = 0; i < myteam.length; i++) {
            var mytim = {
              User_id: myteam[i]._id,
              name: myteam[i].name,
              Mobile_no: myteam[i].Mobile_no,
              city: myteam[i].city,
            }
            teamdata.push(mytim)
          }
          return res.send({ error: false, data: teamdata })
        })
      } else {
        return res.send({ error: true, data: {} })
      }

    })

  })













  app.post('/' + verson + '/myteamcount', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err, myreferid) => {
      if (myreferid != undefined || myreferid != null) {
        if (myreferid.block == 1) {
          return res.send({ error: true, data: {} })
        }
        db.collection('register').countDocuments({ sender_referid: myreferid.my_referid }, (err1, team) => {
          return res.send({ error: false, data: { myTeam: team } })
        })
      } else {
        return res.send({ error: true, data: {} })
      }
    })

  })









  app.post('/' + verson + '/ph_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [

      { $match: { sender_id: objectId(data.User_id) } },

      {
        "$lookup": {
          "from": "register",
          "localField": "receiver_id",
          "foreignField": '_id',
          "as": "output"
        }
      },

      /* {
         '$lookup': {
           "from": "todaypin",
           "localField": "pin_id",
           "foreignField": 'pin_uniqid',
           "as": "mypin"
         }
       },*/

      { $unwind: '$output' },
      // { $unwind: '$mypin' },

      {
        $project: {
          name: '$output.name',
          Mobile_no: '$output.Mobile_no',
          User_id: '$sender_id',
          receiver_id: '$receiver_id',
          // pin_amount: '$mypin.pin_amount',
          // provider_amt: '$mypin.provider_amt',
          // receiver_amt: '$mypin.receiver_amt',
          pin_amount: '$pin_amount',
          provider_amt: '$provider_amt',
          receiver_amt: '$receiver_amt',
          Tr_id: '$Tr_id',
          status: '$status',
          date: '$date'
        }
      }
    ]

    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

      if (myph != undefined || myph != null) {
        return res.send({ error: false, data: myph })
      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })








  app.post('/' + verson + '/rh_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [

      { $match: { receiver_id: objectId(data.User_id) } },

      {
        "$lookup": {
          "from": "register",
          "localField": "sender_id",
          "foreignField": '_id',
          "as": "output"
        }
      },

      { $unwind: '$output' },

      {
        $project: {
          _id: 1,
          User_id: '$receiver_id',
          sender_id: '$sender_id',
          name: '$output.name',
          Mobile_no: '$output.Mobile_no',
          pin_amount: '$pin_amount',
          provider_amt: '$provider_amt',
          receiver_amt: '$receiver_amt',
          use: '$use',
          Tr_id: '$Tr_id',
          status: '$status',
          date: '$date'
        }
      }
    ]

    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

      if (myph != undefined || myph != null) {
        return res.send({ error: false, data: myph })
      } else {
        return res.send({ error: true, data: {} })
      }
    })
  })





  app.post('/' + verson + '/sendAmountHistory', (req, res) => {
   if (!objectId.isValid(req.body.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [{
      $lookup: {
        from: 'register',
        localField: 'receiver_id',
        foreignField: '_id',
        as: 'sender'
      }
    },
    {$unwind: '$sender'},
      {
        $project: {
          _id: 1,
          sender_id: 1,
          receiver_id: 1,
          receiver_name: '$sender.name',
          date: 1,
          Tr_id: 1,
          Mobile_no: '$sender.Mobile_no'
        }
      },
      {$match: {sender_id: objectId(req.body.User_id)}}
  ]
    db.collection('walletTransfer').aggregate(aggregate).toArray((err1, mysendmoney) => {
      res.send({error: false, data: mysendmoney})
    })
  })



  app.post('/' + verson + '/receiveAmountHistory', (req, res) => {
   if (!objectId.isValid(req.body.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [{
      $lookup: {
        from: 'register',
        localField: 'sender_id',
        foreignField: '_id',
        as: 'receiver'
      }
    },
    {$unwind: '$receiver'},
      {
        $project: {
          _id: 1,
          sender_id: 1,
          receiver_id: 1,
          receiver_name: '$receiver.name',
          date: 1,
          Tr_id: 1,
          Mobile_no: '$receiver.Mobile_no'
        }
      },
      {$match: {receiver_id: objectId(req.body.User_id)}}
  ]
    db.collection('walletTransfer').aggregate(aggregate).toArray((err1, mysendmoney) => {
      res.send({error: false, data: mysendmoney})
    })
  })




})
