var express = require('express'),
//ejs = require('ejs'),
//path = require('path'),
bodyParser = require('body-parser'),
//fileUpload = require('express-fileupload'),
 url = 'mongodb://halpingHands:HalpingIsGood@13.235.148.218:53584/helpinghands';
// url = "mongodb://localhost:27017",
dbName = 'helpinghands',
// dbName="money";
MongoClient = require('mongodb').MongoClient,
objectId = require('mongodb').ObjectID,
// session = require('express-session'),
assets = require('assert'),
//http = require('http'),
uniqid = require('randomatic'),
app = express(),
helmet = require('helmet'),
verson = 'v1',
port = '3000';

//var currentTime = new Date()
//    currentTime.setUTCHours(currentTime.getHours()+5);
//    currentTime.setUTCMinutes(currentTime.getMinutes()+30);

// var sess='';

// var BaseUrl = "http://3.6.102.34:"+port;
var BaseUrl = "http://13.235.148.218:"+port+"/v1";
// console.log(BaseUrl)

//app.engine('html', ejs.renderFile);
//app.set('view engine', 'ejs');

//path of website........
//app.use(express.static('views'));

//app.use(express.static(path.join(__dirname, 'views')));

app.use(helmet());

//app.use(fileUpload());

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var multer  = require('multer')
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

// app.use(session({
//   secret: 'fsd84h507JKNJ9hg8&jndas*(jnjzcz',
//   resave: true,
//   saveUninitialized: true
// }));

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  assets.equal(null, err);
  if (err) throw err;
  const db = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)

//  function responseData(file, data, res) {  
  //  data['BaseUrl'] = BaseUrl;
        // data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
    //    res.render(file, data);
     // }


    /*  app.post('/'+verson+'/login', (req, res) => {
        sess = req.session;

        var data = req.body;
        var Mobile_no = data.Mobile_no;
        var password = data.password;


          if (Mobile_no && password) {
          db.collection('register').findOne({Mobile_no: Mobile_no, password: password}, (err, result) => {

            if (err) {
              console.log(err);
            }

            if (result) {


              var datas = {
                User_id : result._id,
                name: result.name,
                Mobile_no: result.Mobile_no,
                city : result.city,
                my_referid: result.my_referid,
                date : result.date
              }
              
             datas = result.block != 1 ? datas : {}
             var errors = result.block != 1 ? false : true

             res.send({ error: errors, data: datas, block: result.block });

            } else {
              res.send({ data: {}, error: true , block: 0 });
            }

          })
        } else {
          res.send({ data: {},error: true , block: 0 });
        }
      })*/


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
          bcrypt.compare(password, result.password, function(err, trueres) {
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



      app.post('/'+verson+'/Forgot', (req, res) => {
        var data = req.body;

        if (!objectId.isValid(data.User_id)) {
          return res.send({error: true, data: {}})
        }

        var query = {
          _id: objectId(data.User_id)
        }

        var updatedata = {
          Mobile_no: data.Mobile_no,
          _id: objectId(data.User_id),
          password: data.new_pass
        }

        db.collection('register').findOne(query, (err, findid) => {
          if(findid){
            if(findid.block == 1){
               return res.send({error: true, data: {}})
            }
            if(findid.Mobile_no == data.Mobile_no){
              db.collection('register').updateOne(query, {$set : updatedata}, (err, result) => {
               return res.send({error: false})
              })
            }else{
             return res.send({error: true, data: {}})
            }
          }else{
           return res.send({error: true, data: {}})
          }
        })
      })


/*      app.post('/'+verson+'/register', (req, res) => {
        var data = req.body;
        var register = {
          name: data.name,
          sender_referid: data.sender_referid,
          Mobile_no: data.Mobile_no,
          password: data.password,
          city: data.city,
          my_referid: uniqid('A0',8),
          block: 0,
          date: new Date()
        }

        db.collection('register').findOne({Mobile_no: data.Mobile_no}, (err, result)=> {
          if(result){
            res.send({error: true, data: 'mobile already exist'})
          }else{
            db.collection('register').insertOne(register, (errs, response) => {
              if(errs){
                return res.send({error: true, data: 'Database Error'});
              }
              res.send({error: false, name: data.name, Mobile_no: data.Mobile_no, city: data.city, my_referid: data.my_referid})
            })
          }
        })
      })*/












  /*    app.post('/'+verson+'/register', (req, res) => {
        var data = req.body;
        
        if(data.sender_referid != ''){
         if(data.name != '' && data.Mobile_no != '' && data.password != '' && data.city != ''){
          db.collection('register').countDocuments({my_referid: data.sender_referid}, (err, result1) => {
            console.log(result1)
            if(result1 == 0){
              return res.send({error: true, data: {}})
            }else{
          var register = {
            name: data.name,
            sender_referid: data.sender_referid,
            Mobile_no: data.Mobile_no,
            password: data.password,
            city: data.city,
            my_referid: uniqid('A0',8),
            block: 0,
            walletBalance: 0,
            date: currentTime
          }
  
          db.collection('register').findOne({Mobile_no: data.Mobile_no}, (err, result)=> {
            if(result){
              res.send({error: true, data: {}})
            }else{
              db.collection('register').insertOne(register, (errs, response) => {
                if(errs){
                  return res.send({error: true, data: {}});
                }
                res.send({error: false, name: data.name, Mobile_no: data.Mobile_no, city: data.city, my_referid: data.my_referid})
              })
            }
          })
        }
        }) 
        }else{
          return res.send({error: true, data: {}})
        }
        }else{
          if(data.name != '' && data.Mobile_no != '' && data.password != '' && data.city != ''){
          var register = {
            name: data.name,
            sender_referid: data.sender_referid,
            Mobile_no: data.Mobile_no,
            password: data.password,
            city: data.city,
            my_referid: uniqid('A0',8),
            block: 0,
            date: currentTime
          }
  
          db.collection('register').findOne({Mobile_no: data.Mobile_no}, (err, result)=> {
            if(result){
              res.send({error: true, data: {}})
            }else{
              db.collection('register').insertOne(register, (errs, response) => {
                if(errs){
                  return res.send({error: true, data: {}});
                }
                res.send({error: false, name: data.name, Mobile_no: data.Mobile_no, city: data.city, my_referid: data.my_referid})
              })
            }
          })
          }else{
          return res.send({error: true, data: {}})
        }
        }

      }) */




/*  app.post('/' + verson + '/register', (req, res) => {
    var data = req.body;

    if (data.sender_referid != '') {
      if (data.name != '' || data.Mobile_no != '' || data.password != '' || data.city != '') {
        db.collection('register').countDocuments({ my_referid: data.sender_referid }, (err, result1) => {
          //console.log(result1)
          if (result1 == 0) {
            return res.send({ error: true, data: {} })
          } else {
            bcrypt.genSalt(saltRounds, (err, salt) => {
              bcrypt.hash(data.password, salt, (err, hash) => {

                var register = {
                  name: data.name,
                  sender_referid: data.sender_referid,
                  Mobile_no: data.Mobile_no,
                  password: hash,
                  city: data.city,
                  walletBalance: 0,
                  my_referid: uniqid('A0', 8),
                  block: 0,
                  date: new Date()
                }

                db.collection('register').findOne({ Mobile_no: data.Mobile_no }, (err, result) => {
                  if (result) {
                    res.send({ error: true, data: {} })
                  } else {
                    db.collection('register').insertOne(register, (errs, response) => {
                      if (errs) {
                        return res.send({ error: true, data: {} });
                      }
                      res.send({ error: false, name: data.name, Mobile_no: data.Mobile_no, walletBalance: 0, city: data.city, my_referid: data.my_referid })
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
      if (data.name != '' || data.Mobile_no != '' || data.password != '' || data.city != '') {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(data.password, salt, (err, hash) => {
            console.log(hash)
            var register = {
              name: data.name,
              sender_referid: data.sender_referid,
              Mobile_no: data.Mobile_no,
              password: hash,
              city: data.city,
              walletBalance: 0,
              my_referid: uniqid('A0', 8),
              block: 0,
              date: new Date()
            }

            db.collection('register').findOne({ Mobile_no: data.Mobile_no }, (err, result) => {
              if (result) {
                res.send({ error: true, data: {} })
              } else {
                db.collection('register').insertOne(register, (errs, response) => {
                  if (errs) {
                    return res.send({ error: true, data: {} });
                  }
                  var nn = {
                    name: data.name, Mobile_no: data.Mobile_no, city: data.city, my_referid: data.my_referid
                  }
                  res.send({ error: false, data: nn })
                })
              }
            })
          })
        })
      } else {
        return res.send({ error: true, data: {} })
      }
    }

  })*/


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
                currentTime.setUTCHours(currentTime.getHours()+5);
                currentTime.setUTCMinutes(currentTime.getMinutes()+30);
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
                      var regsus = {  name: data.name, Mobile_no: data.Mobile_no, walletBalance: 0, city: data.city, my_referid: data.my_referid }
                     return res.send({ error: false, msg:0, data:regsus   })
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










      app.post('/'+verson+'/User_Dashboard',upload.any(), (req, res) => {

        var data= req.body;

        if (!objectId.isValid(data.User_id)) {
          return res.send({error: true, data: {}})
        } 

        db.collection('register').findOne({_id: objectId(data.User_id)}, (err1, validuser) => {

         if(validuser != undefined || validuser != null){
           if(validuser.block == 1){
             return res.send({error: true, data: {}})
           }


                  db.collection('phrh').countDocuments({ sender_id: objectId(data.User_id) }, (err2, ph_link) => { //not working
                    db.collection('phrh').countDocuments({ receiver_id: objectId(data.User_id) }, (err3, rh_link) => { //not working
                      db.collection('register').countDocuments({ sender_referid: validuser.my_referid}, (err4, team) => {


                  // db.collection('pinHistory').find({User_id: data.User_id}).toArray((err5, sumofamount) => {

                   // var sum = 0;
                   // for(var i = 0; i < sumofamount.length; i++){
                   //   sum += parseInt(sumofamount[i].pin_count);
                   // }
                    var currentTime = new Date()
                        currentTime.setUTCHours(currentTime.getHours()+5);
                        currentTime.setUTCMinutes(currentTime.getMinutes()+30);
                    
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
                    
                   return res.send({error: false, data: datass})

                  })          
                //  })         
                 })

                 })

        } else {
         return res.send({error: true, data: {}})
        }

      })

      })

































   /*   app.post('/'+verson+'/Pin_buy', (req, res) => {

        var data= req.body;

        if (!objectId.isValid(data.User_id)) {
          return res.send({error: true, data: 'inValid UserId'})
        } 

        db.collection('register').findOne({_id: objectId(data.User_id)}, (err1, validuser) => {

         if(validuser != undefined || validuser != null){

          db.collection('todaypin').findOne({visible: 0}, (err2, result) => {

            if(result != undefined || result != null){

                if(!(data.pin_count > result.available_pin)){ // less then or equal to not working

                  var insert = {
                    User_id: data.User_id,
                    amount: parseInt(data.amount),
                    pin_count: parseInt(data.pin_count),
                    Tr_id: uniqid('Aa0',12),
                    date: new Date()
                  }

                  db.collection('pinHistory').insertOne(insert, (err3, pinHistory) => {
                    db.collection('todaypin').updateOne({visible: 0}, {$inc : { available_pin: -data.pin_count }}, (err3, available_pin) => {
                      db.collection('todaypin').updateOne({visible: 0}, {$inc : { sold_pin: +data.pin_count }}, (err3, sold_pin) => {
                        db.collection('pinHistory').find({User_id: data.User_id}).toArray((err5, sumofamount) => {

                          var sum = 0;
                          for(var i = 0; i < sumofamount.length; i++){
                            sum += parseInt(sumofamount[i].pin_count);
                          }

                          var datass = {
                            total_pin: sum,
                            sold_pin: 0,
                            available_pin: 0,
                            date: new Date()
                          }
                          
                          res.send({error: false, data: datass})

                        })      
                      })
                    })             
                 })

                }else{
                  res.send({error: true, data: 'available pin only is'})
                }

              }else{
                res.send({error: true, data: 'Pin Not Available'})
              }
            })

        } else {
          res.send({error: true, data: 'User Not Found'})
        }

      })

      }) */




  app.post('/' + verson + '/Pin_buy', (req, res) => {

    var data = req.body;

    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

      if (validuser != undefined || validuser != null) {
        if(validuser.block == 1){
        return res.send({error: true, data: {}})
      }
        db.collection('todaypin').findOne({ visible: 0 }, (err2, result) => {

          if (result != undefined || result != null) {

            if (!(data.pin_count > result.available_pin)) { // less then or equal to not working
              if (!(data.amount > validuser.walletBalance)) {
                
                if(isNaN(data.amount)){
                  return res.send({ error: true, data: {} })
                }else{
                  if(data.amount == '' || data.amount == 0){
                     return res.send({ error: true, data: {} })
                  }else{
                     var mybal = parseInt(data.amount)
                  }
                }

                if(isNaN(data.pin_count)){
                  return res.send({ error: true, data: {} })
                }else{
                  if(data.pin_count == '' || data.pin_count == 0){
                     return res.send({ error: true, data: {} })
                  }else{
                     var mypins = parseInt(data.pin_count)
                  }
                }


                var currentTime = new Date()
                    currentTime.setUTCHours(currentTime.getHours()+5);
                    currentTime.setUTCMinutes(currentTime.getMinutes()+30);


              /*  var insert = {
                  User_id: objectId(data.User_id),
                  amount: mybal,
                  pin_count: mypin,
                  use: 0,
                  Tr_id: uniqid('Aa0', 12),
                  date: currentTime
                }*/
                db.collection('pinHistory').find({ User_id: objectId(data.User_id) }).toArray((err6, ifpinexist) => {
               db.collection('todaypin').findOne({ visible: 0 }, (err9, mypin) => {
                    var insert = {
                      User_id: objectId(data.User_id),
                      amount: mybal,
                      pin_count: mypins,
                      use: 0,
                      pin_id: mypin.pin_uniqid,
                      Tr_id: uniqid('Aa0', 12),
                      date: currentTime
                    }
                  db.collection('pinHistory').insertOne(insert, (err3, pinHistory) => {
                  db.collection('todaypin').updateOne({ visible: 0 }, { $inc: { available_pin: -mypins, sold_pin: +mypins } }, (err4, available_pin) => {
                    db.collection('pinHistory').find({ User_id: objectId(data.User_id) }).toArray((err6, sumofamount) => {
                      db.collection('register').updateOne({ _id: objectId(data.User_id) }, { $inc: { walletBalance: -mybal } }, (err7, mycall) => {
                        db.collection('register').findOne({ _id: objectId(data.User_id) }, (err8, latestamount) => {
                       //  db.collection('todaypin').findOne({visible: 0}, (err9, mypin) => {

                            if (typeof ifpinexist[0] == 'undefined') {
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
                                 // pin_id: mypin.pin_uniqid,
                                  Tr_id: uniqid('Aa0', 12),
                                  date: currentTimes
                                }
                                db.collection('phrh').insertOne(ph_rh)
                                 db.collection('pinHistory').updateOne({ User_id: objectId(data.User_id) }, { $set: { use: 1 } })
                            }

                            var sum = 0;
                            for (var i = 0; i < sumofamount.length; i++) {
                              sum += parseInt(sumofamount[i].pin_count);
                            }

                            var datass = {
                              user_total_pin: sum,
                              total_pin: mypin.total_pin,
                              sold_pin: mypin.sold_pin,
                              available_pin: mypin.available_pin,
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
              } else {
               return res.send({ error: true, data: {} })
              }

            } else {
             return res.send({ error: true, data:{} })
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






     
/*
      app.post('/'+verson+'/confirm_amount', (req, res) => {

        var data = req.body;

        if (!objectId.isValid(data.User_id)) {
          return res.send({error: true, data: 'inValid UserId'})
        } 
        if (!objectId.isValid(data.Tr_user_id)) {
          return res.send({error: true, data: 'inValid ReceiverId'})
        } 

        db.collection('rh_link').findOne({Tr_id: data.TR_ID}, (err, result) => {
          
          if(result != undefined || result != null){

            if(result.use != 1){

              if(result.User_ID == data.User_id){

                db.collection('rh_link').updateOne({Tr_id: data.TR_ID}, {$set: {use: 1}}, (err1, updateuse) => {

                  //sending user wallet data static 
                  res.send({error: false, user_wallet: 0})

                })
           
              }else{
                res.send({error: true, data: 'UserId Not Available'})
              }

            }else{
              res.send({error: true, data: 'transection Already Done'})
            }

          }else{
            res.send({error: true, data: 'transection Id Not Available'})
          }

        })
      })*/



      app.post('/'+verson+'/confirm_amount', (req, res) => {

        var data = req.body;

        if (!objectId.isValid(data.User_id)) {
          return res.send({error: true, data: {}})
        } 
        if (!objectId.isValid(data.Tr_user_id)) {
          return res.send({error: true, data:{}})
        } 

        db.collection('phrh').findOne({Tr_id: data.TR_ID}, (err, result) => {
          
          if(result != undefined || result != null){

            if(result.use != 1){

              if ((result.sender_id).toString() == (data.Tr_user_id).toString()) {

                if ((result.receiver_id).toString() == (data.User_id).toString()) {
              
              if(isNaN(data.amount)){
                return res.send({ error: true, data: {}})
              }else{
                if(data.amount == '' || data.amount == 0){
                   return res.send({ error: true, data: {}})
                }else{
                   var mybal = parseInt(data.amount)
                }
              }

               db.collection('register').findOne({ _id: objectId(data.User_id) }, (err3, updatedamount) => {
                 if(updatedamount.block == 1){
                     return res.send({error: true, data: {}})
                 }
                  db.collection('phrh').updateOne({Tr_id: data.TR_ID}, {$set: {use: 1}}, (err1, updateuse) => {
       //             db.collection('register').updateOne({ _id: objectId(data.User_id) }, { $inc: { walletBalance: +mybal } }, (err2, myrealamount) => {
       //               db.collection('register').findOne({ _id: objectId(data.User_id) }, (err3, updatedamount) => {

                       return res.send({ error: false, user_wallet: updatedamount.walletBalance })

         //             })
                    })

                  })
                }else{
                 return res.send({error: true, data: {}})
                }
           
              }else{
               return res.send({error: true, data: {}})
              }

            }else{
             return res.send({error: true, data: {}})
            }

          }else{
           return res.send({error: true, data: {}})
          }

        })
      })






















    /*  app.post('/'+verson+'/User_wallet_transfer', (req, res) => {

        var data = req.body;
        if (!objectId.isValid(data.User_id)) {
          return res.send({ error: true, data: 'inValid UserId' })
        }

        if (!objectId.isValid(data.receiver_id)) {
          return res.send({ error: true, data: 'inValid receiverId' })
        }

        db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
          db.collection('register').findOne({ _id: objectId(data.receiver_id) }, (err1, receiver) => {

            
            if (validuser != undefined || validuser != null) {
              if (receiver != undefined || receiver != null) {

              var insertdata = {
                User_id: data.User_id,
                amount: parseInt(data.amount),
                receiver_id: data.receiver_id,
                Tr_id: uniqid('Aa0',12),
                date: new Date()
              }

              db.collection('walletTransfer').insertOne(insertdata, (err2, result) => {
                //send to wallet balance data static
                res.send({error: false, Wallet_balance: 0 })
              })

              }else{
                res.send({error: true, data: 'User Not Available'})
              }
            }else{
              res.send({error: true, data: 'Receiver Not Available'})
            }

          })
        })

      }) */


















  app.post('/' + verson + '/User_wallet_transfer', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    if (!objectId.isValid(data.receiver_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
      if(validuser.block == 1){
        return res.send({error: true, data: {}})
      }
      db.collection('register').findOne({ _id: objectId(data.receiver_id) }, (err1, receiver) => {


        if (validuser != undefined || validuser != null) {
          if (receiver != undefined || receiver != null) {
            if(!(parseInt(data.amount) > validuser.walletBalance)){


            var currentTime = new Date()
                currentTime.setUTCHours(currentTime.getHours()+5);
                currentTime.setUTCMinutes(currentTime.getMinutes()+30);

            var insertdata = {
              User_id: data.User_id,
              amount: parseInt(data.amount),
              receiver_id: data.receiver_id,
              Tr_id: uniqid('Aa0', 12),
              date: currentTime
            }

            db.collection('walletTransfer').insertOne(insertdata, (err2, result) => {
              db.collection('register').updateOne({_id: objectId(data.User_id)}, {$inc : {walletBalance: -parseInt(data.amount)}}, (err3, mybalancedown) => {
                db.collection('register').updateOne({_id: objectId(data.receiver_id)}, {$inc : {walletBalance: +parseInt(data.amount)}}, (err3, mybalanceup) => {
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

  })









      app.post('/'+verson+'/User_history', (req, res) => {

        var data = req.body;
        if (!objectId.isValid(data.User_id)) {
          return res.send({ error: true, data: {} })
        }

        db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
          
          if(validuser.block == 1){
             return res.send({error: true, data: {}})
          }
          if (validuser != undefined || validuser != null) {
              
            db.collection('phrh').find({ sender_id: objectId(data.User_id) }).toArray((err2, ph_link) => {
              db.collection('phrh').find({ receiver_id: objectId(data.User_id) }).toArray((err3, rh_link) => {
                db.collection('pinHistory').find({User_id: objectId(data.User_id)}).toArray((err4, pinHistory) => {
                  db.collection('walletTransfer').find({User_id: data.User_id}).toArray((err5, walletTransfer) => {

                    var data = {
                      User_id: validuser._id,
                      Total_ph: ph_link,
                      Total_rh: rh_link,
                      pinHistory: pinHistory,
                      moneyTransfer: walletTransfer
                    }

                   return res.send({error: false, data: data})
                  })
                })
              })
            })

          }else{
           return res.send({error: true, data: {}})
          }
        })
      })





 













     app.post('/'+verson+'/add_balance', (req, res) => {
      var data = req.body;
      if (!objectId.isValid(data.User_id)) {
        return res.send({ error: true, data: {} })
      }

      db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

        if (validuser != undefined || validuser != null) {
          
          if(validuser.block == 1){
             return res.send({error: true, data: {}})
          }

          var currentTime = new Date()
              currentTime.setUTCHours(currentTime.getHours()+5);
              currentTime.setUTCMinutes(currentTime.getMinutes()+30);


          var insert = {
            User_id: objectId(data.User_id),
            amount: data.amount,
            addby: 0,
            tr_id: uniqid('Aa0', 12),
            date: currentTime
          }

          db.collection('walletHistory').insertOne(insert, (err2, result) => {
            db.collection('register').findOneAndUpdate({_id: objectId(data.User_id)}, {$inc: {walletBalance: +parseInt(data.amount)}}, (err3, Incamount) => {
              db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, myamount) => {
              var mydata = {
                User_id: myamount._id,
                walletBalance: myamount.walletBalance
              }
              return res.send({error: false,data: mydata})
            })
            })
          })

        } else {
          return res.send({ error: true, data: {} })
        }
      })
    })






















    app.post('/'+verson+'/Wallet', (req, res) => {
      var data = req.body;
      if (!objectId.isValid(data.User_id)) {
        return res.send({ error: true, data: {} })
      }

      db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {

        if (validuser != undefined || validuser != null) {
          
         if(validuser.block == 1){
            return res.send({error: true, data: {}})
         }
              var mydata = {
                User_id: validuser._id,
                walletBalance: validuser.walletBalance
              }
             return res.send({error: false,data: mydata})

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
        
      if(validuser.block == 1){
        return res.send({error: true, data: {}})
      }
        if(validuser.sender_referid == null){
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










  app.get('/' + verson + '/todayPin', (req, res) => {
    db.collection('todaypin').findOne({ visible: 0 }, (err1, validuser) => {
        if(validuser == null) {
          //validuser = {}
          //return res.send({error: true,mymili: 0, data: validuser })
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
        }else{

        var currentTime = new Date()
        currentTime.setUTCHours(currentTime.getHours()+5);
        currentTime.setUTCMinutes(currentTime.getMinutes()+30);

        var end = validuser.endtime;

        var milisec = (end - currentTime)

        //console.log(milisec)
         return res.send({ error: false,mymili: milisec, data: validuser })
       }
    })
  }) 






















    app.get('/' + verson + '/sharedata', (req, res) => {
      db.collection('sharedata').find({}).sort({_id : -1 }).limit(1).toArray((err, result) => {
    //   res.send(result[0])
         if(result[0] != undefined){
          res.send({error: false, data: result[0]})
        }else{
          res.send({error: true, data: {}})
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




 /* app.post('/' + verson + '/user_wallet_history', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('walletHistory').find({ User_id: data.User_id }).sort({ _id: -1 }).toArray((err4, wallet_history) => {

      if (wallet_history != undefined || wallet_history != null) {
        res.send({ error: false, data: wallet_history })
      } else {
        res.send({ error: true, data: {} })
      }

    })

  })*/



app.post('/' + verson + '/user_wallet_history', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('walletHistory').find({ User_id: objectId(data.User_id) }).sort({ _id: -1 }).toArray((err4, wallet_history) => {
     // db.collection('adminAddAmount').find({ User_id: objectId(data.User_id) }).sort({ _id: -1 }).toArray((err4, admin_wallet_history) => {

        if (wallet_history != undefined || wallet_history != null) {

       /*   var children = wallet_history.concat(admin_wallet_history);
          children.sort(function (x, y) {
            return y.date - x.date;
          })*/

         return res.send({ error: false, data: wallet_history })
        } else {
         return res.send({ error: true, data: {} })
        }

     // })
    })

  })





  app.post('/' + verson + '/myTeam', (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err4, myreferid) => {
   
      if (myreferid != undefined || myreferid != null) {
     if(myreferid.block == 1){
        return res.send({error: true, data: {}})
      }
       db.collection('register').find({sender_referid: myreferid.my_referid}).sort({ _id: -1}).toArray((err3, myteam) => {
           var teamdata = []
          for(var i = 0; i < myteam.length; i++){
            var mytim = {
              User_id : myteam[i]._id,
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
      if(myreferid != undefined || myreferid != null) {
        if(myreferid.block == 1){
        return res.send({error: true, data: {}})
      }  
        db.collection('register').countDocuments({ sender_referid: myreferid.my_referid }, (err1, team) => {
          return res.send({ error: false, data: { myTeam: team } })
        })
      } else {
        return res.send({ error: true, data: {} })
      }
    })

  })











/*  app.post('/' + verson + '/ph_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('ph_link').find({ User_ID: data.User_id }).sort({_id: -1}).toArray((err1, validuser) => {

      if (validuser != undefined || validuser != null) {

        res.send({ error: false, data: validuser })

      } else {
        res.send({ error: true, data: {} })
      }
    })
  })*/


 /* app.post('/' + verson + '/ph_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('ph_link').find({ User_ID: data.User_id }).sort({ _id: -1 }).toArray((err1, validuser) => {
      db.collection('register').findOne({ _id: objectId(data.User_id) }, (err2, mydata) => {

        if (validuser != undefined || validuser != null) {
          if (mydata != undefined || mydata != null) {
 
            var alldata = []
            for(var i = 0; i < validuser.length; i++){
                var gdata = {
                  User_ID: validuser[i].User_ID,
                  pin_amount: validuser[i].pin_amount,
                  provider_amt: validuser[i].provider_amt,
                  receiver_amt: validuser[i].receiver_amt,
                  name: mydata.name,
                  Mobile_no: mydata.Mobile_no,
                  Tr_id: validuser[i].Tr_id,
                  use: validuser[i].use,
                  status: validuser[i].status,
                  date: validuser[i].date
                }
                alldata.push(gdata)
            }


            res.send({ error: false, data: alldata })

          } else {
            res.send({ error: true, data: {} })
          }
        } else {
          res.send({ error: true, data: {} })
        }
      })
    })
  })*/







 /* app.post('/' + verson + '/ph_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [
      
    {$match: {User_id: objectId(data.User_id)}},

    { 
      "$lookup": {
      "from": "register",
      "localField": "User_id",
      "foreignField": '_id',
      "as": "output" }
    },

    { $unwind: '$output'},

    { 
      $project: {
        _id : 0,
        User_id: '$output._id',
        name: '$output.name',
        Mobile_no: '$output.Mobile_no',
        pin_amount: '$pin_amount',
        provider_amt: '$provider_amt',
        receiver_amt: '$receiver_amt',
        Tr_id: '$Tr_id',
        use: '$use',
        status: '$status',
        date: '$date'
    }}]

    db.collection('ph_link').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

        if (myph != undefined || myph != null) {
            res.send({ error: false, data: myph })
          } else {
            res.send({ error: true, data: {} })
          }
      })
    })*/


app.post('/' + verson + '/ph_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [
      
    {$match: {sender_id: objectId(data.User_id)}},

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















 /* app.post('/' + verson + '/rh_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }

    db.collection('rh_link').find({ User_ID: data.User_id }).sort({ _id: -1 }).toArray((err1, validuser) => {
      db.collection('register').findOne({ _id: objectId(data.User_id) }, (err2, mydata) => {

        if (validuser != undefined || validuser != null) {
          if (mydata != undefined || mydata != null) {

            var alldata = []
            for(var i = 0; i < validuser.length; i++){
                var gdata = {
                  User_ID: validuser[i].User_ID,
                  pin_amount: validuser[i].pin_amount,
                  provider_amt: validuser[i].provider_amt,
                  receiver_amt: validuser[i].receiver_amt,
                  name: mydata.name,
                  Mobile_no: mydata.Mobile_no,
                  Tr_id: validuser[i].Tr_id,
                  use: validuser[i].use,
                  status: validuser[i].status,
                  date: validuser[i].date
                }
                alldata.push(gdata)
            }


            res.send({ error: false, data: alldata })

          } else {
            res.send({ error: true, data: {} })
          }
        } else {
          res.send({ error: true, data: {} })
        }
      })
    })
  })*/












/*  app.post('/' + verson + '/rh_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [

    {$match: {User_id: objectId(data.User_id)}},

    { 
      "$lookup": {
      "from": "register",
      "localField": "User_id",
      "foreignField": '_id',
      "as": "output" }
    },

    { $unwind: '$output'},

    { 
      $project: {
        _id : 0, 
        User_id: '$output._id',
        name: '$output.name',
        Mobile_no: '$output.Mobile_no',
        pin_amount: '$pin_amount',
        provider_amt: '$provider_amt',
        receiver_amt: '$receiver_amt',
        Tr_id: '$Tr_id',
        use: '$use',
        status: '$status',
        date: '$date'
    }}]

    db.collection('rh_link').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myrh) => {

        if (myrh != undefined || myrh != null) {
            res.send({ error: false, data: myrh })
          } else {
            res.send({ error: true, data: {} })
          }
      })
    })*/



  app.post('/' + verson + '/rh_link', (req, res) => {
    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
      return res.send({ error: true, data: {} })
    }
    var aggregate = [
      
    {$match: {receiver_id: objectId(data.User_id)}},

    {
      "$lookup": {
      "from": "register",
      "localField": "sender_id",
      "foreignField": '_id',
      "as": "output" }
    },

    { $unwind: '$output'},

    { 
      $project: {
        _id : 1,
        User_id: '$receiver_id',
        sender_id: '$sender_id',
        name: '$output.name',
        Mobile_no: '$output.Mobile_no',
        pin_amount: '$pin_amount',
        provider_amt: '$provider_amt',
        receiver_amt: '$receiver_amt',
        Tr_id: '$Tr_id',
        status: '$status',
        date: '$date'
    }}
  ]

    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

        if (myph != undefined || myph != null) {
           return res.send({ error: false, data: myph })
          } else {
           return res.send({ error: true, data: {} })
          }
      })
    })








    })
