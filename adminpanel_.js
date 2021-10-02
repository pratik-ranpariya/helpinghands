var express = require('express'),
ejs = require('ejs'),
path = require('path'),
bodyParser = require('body-parser'),
fileUpload = require('express-fileupload'),
url = 'mongodb://halpingHands:HalpingIsGood@13.235.148.218:53584/helpinghands';
// url = "mongodb://localhost:27017",
dbName = 'helpinghands',
MongoClient = require('mongodb').MongoClient,
objectId = require('mongodb').ObjectID,
session = require('express-session'),
assets = require('assert'),
uniqid = require('randomatic'),
app = express(),
helmet = require('helmet'),
port = '3001';

// var sess='';

 var BaseUrl = "http://13.235.148.218:"+port;
//var BaseUrl = "http://localhost:"+port;
// console.log(BaseUrl)

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

//path of website........
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'views')));

app.use(helmet());

app.use(fileUpload());

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

  function responseData(file, data, res) {  
    data['BaseUrl'] = BaseUrl;
        // data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
        res.render(file, data);
      }

      app.get('/', (req, res) => {
        var sess = '';
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

        if (Mobile_no && password) {
          db.collection('adminlogin').findOne({Mobile_no: Mobile_no, password: password}, (err, result) => {

            if (err) {
              console.log(err);
            } 

            else if (result) {

              sess.Mobile_no = req.body.Mobile_no;
              console.log(sess.Mobile_no)
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




// get api
      app.get('/resetpin', (req, res) => {
        sess = req.session;

        if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

          var query = {visible: 0}
          var data = {$set: {visible: 1}}

          db.collection('todaypin').updateMany(query, data, (err, todaypin) => {

            var result = {
              total_pin: 0,
              sold_pin: 0,
              available_pin: 0,
              pin_amount: 0
            }

            responseData('adminPanel/dashboard.html', {data : result}, res);

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

//        if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

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

  //      }else{
    //      res.redirect('/');
      //  }
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

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('register').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {

              var data = {
                data: alldata
              }

              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(alldata.length / perPage);

            responseData('adminPanel/providerpage.html',data, res)


           })

          }else{

            res.redirect('/')

          }
      })


            app.get('/rh_link/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('register').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {

              var data = {
                data: alldata
              }

              data['search'] = {};
              data['current'] = page;
              data['pages'] = Math.ceil(alldata.length / perPage);

            responseData('adminPanel/receiverpage.html',data, res)


           })

          }else{

            res.redirect('/')

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



      app.get('/get_rl/:_id', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            if(!objectId.isValid(req.params._id)){
              return res.redirect('/rh_link/1')
            }

          db.collection('register').findOne({_id: objectId(req.params._id)}, (err, result) => {

            var data = {
              data: result
            }

              responseData('adminPanel/inreceiverdata.html',data, res)

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

          if(typeof sess.Mobile_no != undefined || typeof sess.Mobile_no != null){

           var data = req.body;

            var addpin = {
                total_pin: parseInt(data.total_pin),
                sold_pin: 0,
                available_pin: parseInt(data.total_pin),
                pin_amount: parseInt(data.pin_amount),
                provider_amt: parseInt(data.provider_amt),
                receiver_amt: parseInt(data.receiver_amt),
                visible: 0,
                date: new Date()
              }

              db.collection('todaypin').insertOne(addpin)

              res.redirect('/dashboard')

          }else{

            res.redirect('/')

          }
      })


      app.post('/insertph_link', (req, res) => {
        sess = req.session;

          if(typeof sess.Mobile_no != undefined || typeof sess.Mobile_no != null){

           var data = req.body;

            var ph_link = {
                User_ID: data._id,
                name: data.name,
                Mobile_no: data.Mobile_no,
                pin_amount: parseInt(data.pin_amount),
                provider_amt: parseInt(data.provider_amt),
                receiver_amt: parseInt(data.receiver_amt),
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

          if(typeof sess.Mobile_no != undefined || typeof sess.Mobile_no != null){

           var data = req.body;

            var ph_link = {
                User_ID: data._id,
                name: data.name,
                Mobile_no: data.Mobile_no,
                pin_amount: parseInt(data.pin_amount),
                provider_amt: parseInt(data.provider_amt),
                receiver_amt: parseInt(data.receiver_amt),
                Tr_id: uniqid('Aa0',12),
                date: new Date()
              }

              db.collection('rh_link').insertOne(ph_link)

              res.redirect('/rh_link/1')

          }else{

            res.redirect('/')

          }
      })




    })
