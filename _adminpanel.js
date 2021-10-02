var express = require('express'),
ejs = require('ejs'),
path = require('path'),
bodyParser = require('body-parser'),
// fileUpload = require('express-fileupload'),
url = 'mongodb://halpingHands:HalpingIsGood@13.235.148.218:53584/helpinghands',
// url = "mongodb://localhost:27017",
dbName = 'helpinghands',
MongoClient = require('mongodb').MongoClient,
objectId = require('mongodb').ObjectID,
session = require('express-session'),
assets = require('assert'),
// http = require('http'),
uniqid = require('randomatic'),
app = express(),
_date = require('moment'),
// helmet = require('helmet'),
port = '3001';

// var sess='';

var BaseUrl = 'http://13.235.148.218:'+port;
// var BaseUrl = "http://localhost:"+port;
// console.log(BaseUrl)

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

//path of website........
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'views')));

// app.use(helmet());

// app.use(fileUpload());

// app.use(function requireHTTPS(req, res, next) {
//   if (req.secure) {
//     return res.redirect('http://' + req.headers.host + req.url);
//   }
//   next();
// })

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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

app.use(session({
  secret: 'fsd84h507JKNJ9hg8&jndas*(jnjzcz',
  resave: true,
  saveUninitialized: true
}));

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  assets.equal(null, err);
  if (err) throw err;
  const db = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)

  function pagination(collectionName, pagePath, res, req, data) {
 
    var perPage = 10;
    var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    var skip = (perPage * page) - perPage;
    var limit = "LIMIT " + skip + ", " + perPage;
    db.collection(collectionName).find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
      db.collection(collectionName).countDocuments((err, userCount) => {


        for (var i = 0; i < alldata.length; i++) {
          if (alldata[i].date) {
            alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
          }
        }

        data = {
          data: alldata
        }
           
        data['search'] = {};
        data['current'] = page;
        data['pages'] = Math.ceil(userCount / perPage);
        console.log(data);
	console.log(collectionName+'   : '+pagePath);
	responseData(pagePath, data, res)

      })
    })

  }

  function responseData(file, data, res) {  
    data['BaseUrl'] = BaseUrl;
        // data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
        res.render(file, data);
      }

      app.get('/', (req, res) => {
        // var sess = '';
        responseData('adminPanel/index.html', {
            msg: '',
            msgs: '',
            error: true
        }, res);
      })


      app.post('/login', (req, res) => {
        sess = req.session;

        var data = req.body;
        var Mobile_no = data.Mobile_no;
        var password = data.password;

            error: true
        }, res);
      })


      app.post('/login', (req, res) => {
        sess = req.session;

        var data = req.body;
        var Mobile_no = data.Mobile_no;
        var password = data.password;

        if (Mobile_no && password) {
          db.collection('adminlogin').findOne({Mobile_no: Mobile_no, password: password}, (err, result) => {

            if (err) {
              console.log(err);
            } 

            else if (result) {

              sess.Mobile_no = req.body.Mobile_no;
            //  console.log(sess.Mobile_no)
              res.redirect('/dashboard');

            } else {
              responseData('adminPanel/index.html', {
                msg: 'Mobile Number and password not metch',
                msgs: '',
                error: true
              }, res);
            }

          })
        } else {
          responseData('adminPanel/index.html', {
            msg: '',
            msgs: 'Please Enter Mobile Number And Password',
            error: true
          }, res);
        }
      })




//get api
      app.get('/resetpin', (req, res) => {
        sess = req.session;

        if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

          var query = {visible: 0}
          var data = {$set: {visible: 1}}

          db.collection('todaypin').updateMany(query, data, (err, todaypin) => {

/*            var result = {
              total_pin: 0,
              sold_pin: 0,
              available_pin: 0,
              pin_amount: 0
            }

            responseData('adminPanel/dashboard.html', {data : result}, res);
*/
res.redirect('/dashboard');
          //   var resetpin = {
          //     total_pin: 0,
          //     sold_pin: 0,
          //     available_pin: 0,
          //     pin_amount: 0,
          //     provider_amt: 0,
          //     receiver_amt:0,
          //     visible: 0,
          //     date: new Date()
          //   }

          //   db.collection('todaypin').insert(resetpin)

          //   res.redirect('/dashboard')

          //   // res.send({error: false, })
          //   // responseData('adminPanel/category.html', {data : result}, res);

          })

        }else{
          res.redirect('/');
        }
      })


      app.get('/dashboard', (req, res) => {
        sess = req.session;

        if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

          db.collection('todaypin').findOne({visible: 0}, (err, result) => {

            if (result == undefined || result == null || result == 0){

                var result = {
                total_pin: 0,
                sold_pin: 0,
                available_pin: 0,
                pin_amount: 0
              }

              // console.log(result);

            }

            responseData('adminPanel/dashboard.html', {data : result}, res);

          })

        }else{
          res.redirect('/');
        }
      })


      app.get('/addpin', (req, res) => {
         sess = req.session;

         if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

          responseData('adminPanel/addpin.html', {data : {error: false}}, res);

        }else{

          res.redirect('/');

        }
      })

            app.get('/ph_link/:page', (req, res) => {
        sess = req.session;

        if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

          var perPage = 10;
          var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
          var skip = (perPage * page) - perPage;
          var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('register').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
              db.collection('register').countDocuments((err, userCount) => {
              var data = {
                data: alldata
              }

              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(userCount / perPage);

            responseData('adminPanel/providerpage.html',data, res)
            })

           })

          }else{

            res.redirect('/')

          }
      })


          app.post('/ph_link/:page', (req, res) => {
        sess = req.session;
        var perPage = 10;
        var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
        var skip = (perPage * page) - perPage;
        var limit = "LIMIT " + skip + ", " + perPage;

        if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
            
            var wh = {};
            if (req.body.Mobile_no) {
              wh['Mobile_no'] = (req.body.Mobile_no).replace(/\s/g, '');
          }
            
            if (req.body.todate != '' && req.body.fromdate != '') {
                wh['$and'] = [{
                    date: {
                        $gte: new Date(req.body.todate + ' 00:00:00')
                    }
                }, {
                    date: {
                        $lte: new Date(req.body.fromdate + ' 23:59:59')
                    }
                }]
            }

            // console.log(wh)
            db.collection('register').countDocuments(wh, (err, userCount) => {
                db.collection('register').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                    var data = {
                      data: users,
                      error: false
                    }
                    data['search'] = req.body;
                    data['current'] = page;
                    data['pages'] = Math.ceil(userCount / perPage);
                    responseData('adminPanel/providerpage.html', data, res);
                })
            })
        }
        else {
            res.redirect('/');
        }
    })



    app.post('/rh_link/:page', (req, res) => {
      sess = req.session;
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
          
          var wh = {};
          if (req.body.Mobile_no) {
            wh['Mobile_no'] = (req.body.Mobile_no).replace(/\s/g, '');
          }

          wh['status'] = 0;
          
          if (req.body.todate != '' && req.body.fromdate != '') {
              wh['$and'] = [{
                  date: {
                      $gte: new Date(req.body.todate + ' 00:00:00')
                  }
              }, {
                  date: {
                      $lte: new Date(req.body.fromdate + ' 23:59:59')
                  }
              }]
          }

          db.collection('ph_link').countDocuments(wh, (err, userCount) => {
              db.collection('ph_link').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                for (var i = 0; i < users.length; i++) {
                  if (users[i].date) {
                    users[i].date = _date(users[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }
                  var data = {
                    data: users,
                    error: false
                  }
                  data['search'] = req.body;
                  data['current'] = page;
                  data['pages'] = Math.ceil(userCount / perPage);
                  responseData('adminPanel/receiverpage.html', data, res);
              })
          })
      }
      else {
          res.redirect('/');
      }
    })


    app.post('/userlist/:page', (req, res) => {
      sess = req.session;
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
          
          var wh = {};
          if (req.body.Mobile_no) {
            wh['Mobile_no'] = (req.body.Mobile_no).replace(/\s/g, '');
          }
          
          if (req.body.todate != '' && req.body.fromdate != '') {
              wh['$and'] = [{
                  date: {
                      $gte: new Date(req.body.todate + ' 00:00:00')
                  }
              }, {
                  date: {
                      $lte: new Date(req.body.fromdate + ' 23:59:59')
                  }
              }]
          }
          
          db.collection('register').countDocuments(wh, (err, userCount) => {
              db.collection('register').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                for (var i = 0; i < users.length; i++) {
                  if (users[i].date) {
                    users[i].date = _date(users[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }
                  var data = {
                    data: users,
                    error: false
                  }
                  data['search'] = req.body;
                  data['current'] = page;
                  data['pages'] = Math.ceil(userCount / perPage);
                  responseData('adminPanel/userlist.html', data, res);
              })
          })
      }
      else {
          res.redirect('/');
      }
    })


        /*    app.get('/rh_link/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('register').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
              db.collection('register').countDocuments({use: 1}, (err, userCount) => {
              var data = {
                data: alldata
              }

              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(userCount / perPage);

            responseData('adminPanel/receiverpage.html',data, res)
            })

           })

          }else{

            res.redirect('/')

          }
      })*/

   /*  app.get('/rh_link/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('ph_link').find({status: 0}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
                    data['current'] = page;
                    data['pages'] = Math.ceil(userCount / perPage);
                    responseData('adminPanel/providerpage.html', data, res);
                })
            })
        }
        else {
            res.redirect('/');
        }
    })*/

   app.get('/rh_link/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('ph_link').find({status: 0}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
              db.collection('ph_link').countDocuments({status: 0},(err, userCount) => {

                for (var i = 0; i < alldata.length; i++) {
                  if (alldata[i].date) {
                    alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }

                data = {
                  data: alldata
                }

                data['search'] = {};
                data['current'] = page;
                data['pages'] = Math.ceil(userCount / perPage);
                responseData('adminPanel/receiverpage.html', data, res)
              })
            })
          }else{
            res.redirect('/')
          }
      })



    app.post('/rh_link/:page', (req, res) => {
      sess = req.session;
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
          
          var wh = {};
          if (req.body.Mobile_no) {
            wh['Mobile_no'] = (req.body.Mobile_no).replace(/\s/g, '');
          }

          wh['status'] = 0;
          
          if (req.body.todate != '' && req.body.fromdate != '') {
              wh['$and'] = [{
                  date: {
                      $gte: new Date(req.body.todate + ' 00:00:00')
                  }
              }, {
                  date: {
                      $lte: new Date(req.body.fromdate + ' 23:59:59')
                  }
              }]
          }

          db.collection('ph_link').countDocuments(wh, (err, userCount) => {
              db.collection('ph_link').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                for (var i = 0; i < users.length; i++) {
                  if (users[i].date) {
                    users[i].date = _date(users[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }
                  var data = {
                    data: users,
                    error: false
                  }
                  data['search'] = req.body;
                  data['current'] = page;
                  data['pages'] = Math.ceil(userCount / perPage);
                  responseData('adminPanel/receiverpage.html', data, res);
              })
          })
      }
      else {
          res.redirect('/');
      }
    })


    app.post('/userlist/:page', (req, res) => {
      sess = req.session;
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
          
          var wh = {};
          if (req.body.Mobile_no) {
            wh['Mobile_no'] = (req.body.Mobile_no).replace(/\s/g, '');
          }
          
          if (req.body.todate != '' && req.body.fromdate != '') {
              wh['$and'] = [{
                  date: {
                      $gte: new Date(req.body.todate + ' 00:00:00')
                  }
              }, {
                  date: {
                      $lte: new Date(req.body.fromdate + ' 23:59:59')
                  }
              }]
          }
          
          db.collection('register').countDocuments(wh, (err, userCount) => {
              db.collection('register').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                for (var i = 0; i < users.length; i++) {
                  if (users[i].date) {
                    users[i].date = _date(users[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }
                  var data = {
                    data: users,
                    error: false
                  }
                  data['search'] = req.body;
                  data['current'] = page;
                  data['pages'] = Math.ceil(userCount / perPage);
                  responseData('adminPanel/userlist.html', data, res);
              })
          })
      }
      else {
          res.redirect('/');
      }
    })


        /*    app.get('/rh_link/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('register').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
              db.collection('register').countDocuments({use: 1}, (err, userCount) => {
              var data = {
                data: alldata
              }

              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(userCount / perPage);

            responseData('adminPanel/receiverpage.html',data, res)
            })

           })

          }else{

            res.redirect('/')

          }
      })*/

     app.get('/rh_link/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('ph_link').find({status: 0}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
              db.collection('ph_link').countDocuments({status: 0},(err, userCount) => {

                for (var i = 0; i < alldata.length; i++) {
                  if (alldata[i].date) {
                    alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }

                data = {
                  data: alldata
                }

                data['search'] = {};
                data['current'] = page;
                data['pages'] = Math.ceil(userCount / perPage);
                responseData('adminPanel/receiverpage.html', data, res)
              })
            })
          }else{
            res.redirect('/')
          }
      })
       



    app.get('/userwallet/:page', (req, res) => {
      sess = req.session;

        if(sess.Mobile_no != undefined || sess.Mobile_no != null){

          var collectionName = 'register';
          var pagePath = 'adminPanel/userwallet.html';
          var data = {
            error: false
          }
          pagination(collectionName, pagePath, res, req, data)

        }else{
          res.redirect('/')
        }
    })

    app.post('/userwallet/:page', (req, res) => {
      sess = req.session;
      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
          
          var wh = {};
          if (req.body.Mobile_no) {
            wh['Mobile_no'] = (req.body.Mobile_no).replace(/\s/g, '');
          }
          
          if (req.body.todate != '' && req.body.fromdate != '') {
              wh['$and'] = [{
                  date: {
                      $gte: new Date(req.body.todate + ' 00:00:00')
                  }
              }, {
                  date: {
                      $lte: new Date(req.body.fromdate + ' 23:59:59')
                  }
              }]
          }
          
          db.collection('register').countDocuments(wh, (err, userCount) => {
              db.collection('register').find(wh).skip(skip).limit(perPage).toArray((err, users) => {
                for (var i = 0; i < users.length; i++) {
                  if (users[i].date) {
                    users[i].date = _date(users[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }
                  var data = {
                    data: users,
                    error: false
                  }
                  data['search'] = req.body;
                  data['current'] = page;
                  data['pages'] = Math.ceil(userCount / perPage);
                  responseData('adminPanel/userwallet.html', data, res);
              })
          })
      }
      else {
          res.redirect('/');
      }
    })


    app.post('/getwalletAmount', (req, res) => {
      var data = req.body
      db.collection('register').findOne({_id: objectId(data._id)}, (err, mydata) => {
        res.send({data: mydata})
      })
    })


   /* app.post('/updatewalletbyadmin', (req, res) => {
      sess = req.session;

      if(sess.Mobile_no != undefined || sess.Mobile_no != null){

        var data = req.body;

        var mydata = {
          User_id: data._id,
          amount: data.price+data.amount,
          Tr_id: uniqid('Aa0', 12),
          date: new Date() 
        }

        if('+' == data.price){

          var query = { _id: objectId(data._id)};
          var data = { $inc: { walletBalance: +parseInt(data.amount) }}

          db.collection('register').updateMany(query, data, function (err, result2) {
            db.collection('adminAddAmount').insertOne(mydata, (err2, mycoll) => {
              res.send({error: false})
            })
          })

        }else if('-' == data.price){
          var query = { _id: objectId(data._id)};
          var data = { $inc: { walletBalance: -parseInt(data.amount) }}

          db.collection('register').updateMany(query, data, function (err, result2) {
            db.collection('adminAddAmount').insertOne(mydata, (err2, mycoll) => {
              res.send({error: false})
            })
          })

        }

      } else {
        res.redirect('/admin');
      }
    })*/


   app.post('/updatewalletbyadmin', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      db.collection('register').findOne({ _id: objectId(req.body._id) }, (err3, indata) => {
        var data = req.body;
        var mydata = {
          User_id: data._id,
          name: indata.name,
          Mobile_no: indata.Mobile_no,
          amount: data.price + data.amount,
          Tr_id: uniqid('Aa0', 12),
          date: new Date()
        }

        if ('+' == data.price) {

          var query = { _id: objectId(data._id) };
          var data = { $inc: { walletBalance: +parseInt(data.amount) } }

          db.collection('register').updateMany(query, data, function (err, result2) {
            db.collection('adminAddAmount').insertOne(mydata, (err2, mycoll) => {
              res.send({ error: false })
            })
          })

        } else if ('-' == data.price) {
          var query = { _id: objectId(data._id) };
          var data = { $inc: { walletBalance: -parseInt(data.amount) } }

          db.collection('register').updateMany(query, data, function (err, result2) {
            db.collection('adminAddAmount').insertOne(mydata, (err2, mycoll) => {
              res.send({ error: false })
            })
          })
        }

      })

    } else {
      res.redirect('/admin');
    }
  })






      app.get('/get_pl/:_id', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            if(!objectId.isValid(req.params._id)){
              return res.redirect('/ph_link/1')
            }

          db.collection('register').findOne({_id: objectId(req.params._id)}, (err, result) => {

            var data = {
              data: result
            }

              responseData('adminPanel/inproviderdata.html',data, res)

          })

          }else{

            res.redirect('/')

          }
      })

     app.get('/userlist/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var collectionName = 'register';
            var pagePath = 'adminPanel/userlist.html';
            var data = {
              error: false
            }
            pagination(collectionName, pagePath, res, req, data)

          }else{
            res.redirect('/')
          }
      })

      app.get('/userdata/:_id', (req, res) => {
        sess = req. session; 
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){
           db.collection('register').findOne({_id: objectId(req.params._id)}, (err1, register) => {
             db.collection('ph_link').countDocuments({User_ID: req.params._id}, (err2, phcount) => {
              db.collection('rh_link').countDocuments({receiver_id: req.params._id}, (err3, rhcount) => {
                db.collection('pinHistory').find({User_id: req.params._id}).toArray((err4, phistory) => {
                  db.collection('walletTransfer').find({User_id: req.params._id}).toArray((err4, wt) => {

                    for (var i = 0; i < register.length; i++) {
                      if (register[i].date) {
                        register[i].date = _date(register[i].date).format('DD/MM/YYYY h:mm:ss a');
                      }
                    }

                    for (var i = 0; i < phistory.length; i++) {
                      if (phistory[i].date) {
                        phistory[i].date = _date(phistory[i].date).format('DD/MM/YYYY h:mm:ss a');
                      }
                    }

                    for (var i = 0; i < wt.length; i++) {
                      if (wt[i].date) {
                        wt[i].date = _date(wt[i].date).format('DD/MM/YYYY h:mm:ss a');
                      }
                    }
                  
                    var data = {
                      userdetail: register,
                      phcount: phcount,
                      rhcount: rhcount,
                      pinhistory: phistory,
                      walletTransfer: wt
                    }
                    
                    responseData('adminPanel/userdetail.html', data, res)
                  })
                })
              })
             })
           })
        }else{
          res.redirect('/')
        }
      })

  app.get('/block/:_id', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
      db.collection("register").findOne({ _id: objectId(req.params._id) }, (err, result) => {
        if (result.block == 'checked') {
          var item = {
            block: 0,
          };
          db.collection('register').updateOne({ _id: objectId(req.params._id) }, { $set: item })
        } else {
          var item = {
            block: 'checked',
          };
          db.collection('register').updateOne({ _id: objectId(req.params._id) }, { $set: item })
        }
      })
    }
  })
      app.get('/get_rl/:_id', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            if(!objectId.isValid(req.params._id)){
              return res.redirect('/rh_link/1')
            }

            db.collection('register').findOne({_id: objectId(req.params._id)}, (err, result) => {

              db.collection('ph_link').find({User_ID: {$nin: [req.params._id]} , status: 0}).toArray((err2, status) => {
               
                for (var i = 0; i < status.length; i++) {
                  status[i].date = _date(status[i].date).format('DD/MM/YYYY');
                }
                var data = {
                  results: result,
                  statuss: status
                }
                responseData('adminPanel/inreceiverdata.html',data, res)
              })

            })

          }else{
            res.redirect('/')
        }
      })


    app.get('/logout', (req, res) => {
      req.session.destroy(function (err) {
        console.log(err);
        res.redirect('/');
      })
    })


//insert api

      app.post('/insertpin', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

          var data = req.body;
          var query = {visible: 0}
          var value = {$set: {visible: 1}}

           db.collection('todaypin').updateMany(query, value, (err1, visibility) => {

            var addpin = {
              total_pin: parseInt(data.total_pin),
              sold_pin: 0,
              starttime: new Date(data.fromdate),
              endtime: new Date(data.todate),
              available_pin: parseInt(data.total_pin),
              pin_amount: parseInt(data.pin_amount),
              provider_amt: parseInt(data.provider_amt),
              receiver_amt: parseInt(data.receiver_amt),
              visible: 0,
              date: new Date()
            }

            db.collection('todaypin').insertOne(addpin, (err2, insertsucess) => {
              clearTimeouts(removetimer)
              callaftetTime(new Date(data.fromdate), new Date(data.todate));
              res.redirect('/dashboard')
            })

           })

          }else{

            res.redirect('/')

          }
      })


      app.post('/insertph_link', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

           var data = req.body;

            var ph_link = {
                User_ID: data._id,
                name: data.name,
                Mobile_no: data.Mobile_no,
                pin_amount: parseInt(data.pin_amount),
                provider_amt: parseInt(data.provider_amt),
                receiver_amt: parseInt(data.receiver_amt),
                use: 0,
                status: 0,
                Tr_id: uniqid('Aa0',12),
                date: new Date()
              }

              db.collection('ph_link').insertOne(ph_link)

              res.redirect('/ph_link/1')

          }else{

            res.redirect('/')

          }
      })



       app.post('/insertrh_link', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

           var data = req.body;
           db.collection('ph_link').findOne({Tr_id: data.Tr_id}, (err1, getsenderId) => {

            var ph_link = {
              sender_id: getsenderId.User_ID,
              receiver_id: data._id,
              name: data.name,
              Mobile_no: data.Mobile_no,
              pin_amount: parseInt(data.pin_amount),
              use: 0,
              Tr_id: uniqid('Aa0',12),
              date: new Date()
            }
            db.collection('ph_link').updateOne({Tr_id: data.Tr_id}, {$set: { status: 1}})
              db.collection('rh_link').insertOne(ph_link)
                res.redirect('/rh_link/1')
           })

          }else{
            res.redirect('/')
          }
      })


      // function callbeforeTime(startDate,endDate){

      //   var currentTime = new Date()
      //   currentTime.setUTCHours(currentTime.getHours()+5);
      //   currentTime.setUTCMinutes(currentTime.getMinutes()+30);
      //   var timeDiff = startDate - currentTime;

      //   removetimer = setTimeout(() => {
      //     //db.collection('todaypin').updateMany({ visible: 0 }, { $set: { visible: 1 } })

      //   }, timeDiff);
      // }



      function callaftetTime(startDate,endDate){

        var currentTime = new Date()
        currentTime.setUTCHours(currentTime.getHours()+5);
        currentTime.setUTCMinutes(currentTime.getMinutes()+30);
        var timeDiff = endDate - currentTime;

        removetimer = setTimeout(() => {
          db.collection('todaypin').updateMany({ visible: 0 }, { $set: { visible: 1 } })

        }, timeDiff);
      }

      function clearTimeouts() {
        clearTimeout(removetimer);
      }


      

      app.get('/History', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){ 
            responseData('adminPanel/history.html',{ error: false}, res);
          }else{
            res.redirect('/');
          }
      })

      app.get('/phhistory/:page', (req, res) => {
        
        sess = req.session;
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){ 

          var collectionName = 'ph_link';
          var pagePath = 'adminPanel/phhistory.html';
          var data = {
            error: false
          }
          pagination(collectionName, pagePath, res, req, data)

        }else{
          res.redirect('/');
        }
      })


      app.get('/rhhistory/:page', (req, res) => {
        
        sess = req.session;
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){ 

          var collectionName = 'rh_link';
          var pagePath = 'adminPanel/rhhistory.html';
          var data = {
            error: false
          }
          pagination(collectionName, pagePath, res, req, data)

        }else{
          res.redirect('/');
        }
      })


      app.get('/addpinhistory/:page', (req, res) => {
        
        sess = req.session;
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){ 

          var collectionName = 'todaypin';
          var pagePath = 'adminPanel/addpinhistory.html';
          var data = {
            error: false
          }
          pagination(collectionName, pagePath, res, req, data)

        }else{
          res.redirect('/');
        }
      })


      app.get('/purchasePinHistory/:page', (req, res) => {
        
        sess = req.session;
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){ 

          var perPage = 10;
          var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
          var skip = (perPage * page) - perPage;
          var limit = "LIMIT " + skip + ", " + perPage;
          db.collection('pinHistory').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
            db.collection('register').find({}).toArray((err, register) => {
              db.collection('pinHistory').countDocuments((err, userCount) => {
            // for (var i = 0; i < alldata.length; i++) {
            //   alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
            // }

            var doubledata = [];
            for(var i = 0; i < alldata.length; i++){
              for(var j = 0; j < register.length; j++){
                if(alldata[i].User_id == register[j]._id){
                  var mydata = {
                    name: register[j].name,
                    mobile: register[j].Mobile_no,
                    User_id: alldata[i].User_id,
                    amount: alldata[i].amount,
                    pin_count: alldata[i].pin_count,
                    Tr_id: alldata[i].Tr_id,
                    date: _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a')
                  }
                  doubledata.push(mydata)
                }
              }
            }

            var data = {
              data: doubledata
            }

            data['search'] = {};
            data['current'] = page;
            data['pages'] = Math.ceil(userCount / perPage);

          responseData('adminPanel/purchasePinHistory.html',data, res)
          })
        })
        })
        }else{
          res.redirect('/');
        }
      })



      app.get('/cAmountHistory/:page', (req, res) => {
        
        sess = req.session;
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){ 

          var perPage = 10;
          var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
          var skip = (perPage * page) - perPage;
          var limit = "LIMIT " + skip + ", " + perPage;
          db.collection('rh_link').find({use: 1}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
            db.collection('rh_link').countDocuments({use: 1}, (err, userCount) => {
              var data = {
                data: alldata
              }

              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(userCount / perPage);

            responseData('adminPanel/cAmountHistory.html',data, res)
            })
          })
        }else{
          res.redirect('/');
        }
      })



    })
