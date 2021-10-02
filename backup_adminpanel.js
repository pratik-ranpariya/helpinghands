/*var express = require('express'),
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
 //  helmet = require('helmet'),
  port = '3001';

// var sess='';
var removetimer;
BaseUrl = 'http://13.235.148.218:' + port;
// var BaseUrl = "http://localhost:"+port;
// console.log(BaseUrl)

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

//path of website........
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'views')));

// app.use(helmet());

// app.use(fileUpload());



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var currentTime = new Date();
    currentTime.setUTCHours(currentTime.getHours()+5);
    currentTime.setUTCMinutes(currentTime.getMinutes()+30);


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
}));*/


var express = require('express'),
  ejs = require('ejs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  // fileUpload = require('express-fileupload'),
   url = 'mongodb://halpingHands:HalpingIsGood@13.235.148.218:53584/helpinghands',
  // url = "mongodb://localhost:27017",
   dbName = 'helpinghands',
  //url = 'mongodb://ohhcatfood:myNewCatFoodHere@15.207.37.189:53584/catfood',
  //dbName = 'catfood',
  MongoClient = require('mongodb').MongoClient,
  objectId = require('mongodb').ObjectID,
  session = require('express-session'),
  assets = require('assert'),
  // http = require('http'),
  uniqid = require('randomatic'),
  app = express(),
  _date = require('moment'),
  // helmet = require('helmet'),
  port = '3003';

// var sess='';
var removetimer, removetimes;
BaseUrl = 'http://13.235.148.218:' + port;
// var BaseUrl = "http://localhost:"+port;
// console.log(BaseUrl)

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

//path of website........
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'views')));

// app.use(helmet());

// app.use(fileUpload());


app.use(bodyParser.urlencoded({ extended: true }))
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



db.collection('todaypin').find({visible: 0}).sort({_id: -1}).toArray((err, mypin) => {
    clearTimeouts(removetimer)
    if(mypin[0] != undefined){
      console.log(mypin[0].starttime)
      callaftetTime(new Date(mypin[0].starttime), new Date(mypin[0].endtime));
    }
  })



db.collection('todaypin').find({visible: 2}).sort({_id: -1}).toArray((err, mypin) => {
    myTime(removetimes)
    if(mypin[0] != undefined){
      console.log(mypin[0].starttime)
      callbeforeTime(new Date(mypin[0].starttime));
    }
  })



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
      //  console.log(data);
      //  console.log(collectionName + '   : ' + pagePath);
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

    if (Mobile_no && password) {
      db.collection('adminlogin').findOne({ Mobile_no: Mobile_no, password: password }, (err, result) => {

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

      var queryone = { visible: 0 }
      var querytwo = { visible: 2 }
      var data = { $set: { visible: 1 } }
      clearTimeout(removetimes)
      clearTimeouts(removetimer)
      db.collection('todaypin').updateMany(queryone, data, (err, todaypin) => {
        db.collection('todaypin').updateMany(querytwo, data, (err, todaypin) => {
        res.redirect('/dashboard');
        })
      })
    } else {
      res.redirect('/');
    }
  })



 /* app.get('/dashboard', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      db.collection('todaypin').findOne({ visible: 0 }, (err, result) => {

        if (result == undefined || result == null || result == 0) {

          var result = {
            total_pin: 0,
            sold_pin: 0,
            available_pin: 0,
            pin_amount: 0
          }

          // console.log(result);

        }

        responseData('adminPanel/dashboard.html', { data: result }, res);

      })

    } else {
      res.redirect('/');
    }
  })*/


  app.get('/dashboard', (req, res) => {
    sess = req.session;

    if (typeof sess.Mobile_no != 'undefined') {

      db.collection('todaypin').findOne({ visible: 0 }, (err, result) => {
        db.collection('todaypin').findOne({ visible: 2 }, (err1, pincoming) => {

          if (result) {
            if (result.visible == 0) {
              result = {
                "_id": result._id,
                "total_pin": result.total_pin,
                "sold_pin": result.sold_pin,
                "starttime": result.starttime,
                "endtime": result.endtime,
                "available_pin": result.available_pin,
                "pin_amount": result.pin_amount,
                "provider_amt": result.provider_amt,
                "receiver_amt": result.receiver_amt,
                "visible": result.visible,
                "pin_uniqid": result.pin_uniqid,
                "date": result.date
              }
            }
          }else if (pincoming) {
            if (pincoming.visible == 2) {
              result = {
                "_id": pincoming._id,
                "total_pin": 0,
                "sold_pin": 0,
                "starttime": pincoming.starttime,
                "endtime": pincoming.endtime,
                "available_pin": 0,
                "pin_amount": 0,
                "provider_amt": pincoming.provider_amt,
                "receiver_amt": pincoming.receiver_amt,
                "visible": pincoming.visible,
                "pin_uniqid": pincoming.pin_uniqid,
                "date": pincoming.date
              }
            }
          } else {
            result = {
              total_pin: 0,
              sold_pin: 0,
              available_pin: 0,
              pin_amount: 0,
              starttime: 0,
            }
          }
        responseData('adminPanel/dashboard.html', { data: result }, res);
      })
    })
    } else {
      res.redirect('/');
    }
  })

app.get('/rcl', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
 
    db.collection('todaypin').find({}).sort({_id: 1}).limit(1).toArray((err, firstpin) => {
    if(firstpin[0] == null){
    var firstpin = [{starttime: new Date(0)}]
    } 
    var date2 = new Date(firstpin[0].starttime);
    date2.setDate(date2.getDate() + 3)
    date2.setUTCHours(23, 59, 59, 59);

    var wh = {}
    wh['$and'] = [{
      date: {
        $gte: new Date(firstpin[0].starttime)
      }
    }, {
      date: {
        $lte: new Date(date2)
      }
    }]

    var aggregate = [
      {
        $lookup: {
          "from": "pinHistory",
          "localField": "_id",
          "foreignField": 'User_id',
          "as": "item"
        }
      },
      { $unwind: '$item' },
      { $match: { 'item.use': 0 } },
      {
        $project: {
          _id: '$_id',
          oid: '$item._id',
          name: '$name',
          Mobile_no: '$Mobile_no',
          walletBalance: '$walletBalance',
          date: '$item.date'
        }
      },
      {$sort: {date: 1}},

      { $match: wh}
    ]
   db.collection('register').aggregate(aggregate).toArray((err, fpin) => {

      if (fpin) {
        for (var i = 0; i < fpin.length; i++) {
          fpin[i].date = _date(fpin[i].date).format('DD/MM/YYYY h:mm:ss a');
        }
      }
    
      var data = {
        data: fpin
      }
      responseData('adminPanel/rcl.html', data, res)
    })
    })
    } else {
      res.redirect('/');
    }
  })

app.post('/givercl', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      db.collection('todaypin').find({}).sort({ _id: 1 }).limit(1).toArray((err, mypin) => {

        var alldata = req.body.submit
        var splitval = alldata.split(",")
        splitval.pop()

        var kk = []
        for (var i = 0; i < splitval.length; i++) {
          kk.push(objectId(splitval[i]))
        }

        for (var i = 0; i < kk.length; i++) {
         db.collection('pinHistory').find({ _id: kk[i], use: 0 }).sort({ _id: 1 }).toArray((err, mylastpin) => {
            for (var j = 0; j < mylastpin.length; j++) {

          var currentTimes = new Date()
          currentTimes.setUTCHours(currentTimes.getHours() + 5);
          currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
          var ph_rh = {
            sender_id: objectId(mylastpin[j].User_id),
            receiver_id: objectId('5f9152ea2077887163bf3db6'),
            pin_amount: parseInt(mypin[0].pin_amount),
            provider_amt: parseInt(mypin[0].provider_amt),
            receiver_amt: parseInt(mypin[0].receiver_amt),
            use: 0,
            Tr_id: uniqid('Aa0', 12),
            date: currentTimes
          }
          db.collection('phrh').insertOne(ph_rh)

              var query = { _id: objectId(mylastpin[j]._id) }
              var value = { $set: { use: 1 } }
              db.collection('pinHistory').updateOne(query, value)
            }
          })

          if (kk.length == i + 1) {
            return res.send({ error: false })
          }
        }
      })
    } else {
      res.redirect('/');
    }

  })

  app.get('/addpin', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      responseData('adminPanel/addpin.html', { data: { error: false } }, res);

    } else {

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
      db.collection('register').find({ walletBalance: { $gt: 0}}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('register').countDocuments((err, userCount) => {
          var data = {
            data: alldata
          }

          data['search'] = {};
          data['current'] = page;
          data['pages'] = Math.ceil(userCount / perPage);

          responseData('adminPanel/providerpage.html', data, res)
        })

      })

    } else {

      res.redirect('/')

    }
  })

  app.get('/phrh/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      db.collection('todaypin').find({}).sort({_id: 1}).limit(1).toArray((err, firstpin) => {
        if(firstpin[0] == null){
          var firstpin = [{starttime: new Date(0)}]
        }
        const date2 = new Date(firstpin[0].starttime);
        date2.setDate(date2.getDate() + 3)
        date2.setUTCHours(23, 59, 59, 59);
   
        var wh = {}
        wh['$and'] =  [{
          date: {
            $gt: new Date(date2)
          }
        }]

      var aggregate = [
        {
          $lookup: {
            "from": "pinHistory",
            "localField": "_id",
            "foreignField": 'User_id',
            "as": "item"
          }
        },
        { $unwind: "$item" },
        { $match: { "item.use": 0 } },
        {
          $project: {
            _id: 1,
            oid: '$item._id',
            name: 1,
            Mobile_no: 1,
            date: '$item.date'
          }
        },
        {$match: wh }
      ]

      db.collection('register').aggregate(aggregate).skip(skip).limit(perPage).toArray((err, alldata) => {
        aggregate.push({ $count: "total" });
        db.collection('register').aggregate(aggregate).toArray((err, userCount) => {
          if (userCount[0] == undefined) {
            userCount[0] = 0
          }
          data = {
            data: alldata
          }
          data['search'] = {};
          data['current'] = page;
          data['pages'] = Math.ceil(userCount[0].total / perPage);

          responseData('adminPanel/providerpage.html', data, res)
        })
      })
    })
    } else {
      res.redirect('/')
    }
  })


  app.post('/phrh/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      db.collection('todaypin').find({}).sort({_id: 1}).limit(1).toArray((err, firstpin) => {
        if(firstpin[0] == null){
          var firstpin = [{starttime: new date(0)}]
        }
        const date2 = new Date(firstpin[0].starttime);
        date2.setDate(date2.getDate() + 3)
        date2.setUTCHours(23, 59, 59, 59);

        
        var hh = {};
        hh['$and'] = [{
          date: {
            $gt: new Date(date2)
          }
        }]

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

      var aggregate = [
        {
          $lookup: {
            "from": "pinHistory",
            "localField": "_id",
            "foreignField": 'User_id',
            "as": "item"
          }
        },
        { $unwind: "$item" },
        { $match: { "item.use": 0 } },
        {
          $project: {
            _id: 1,
            oid: '$item._id',
            name: 1,
            Mobile_no: 1,
            date: '$item.date'
          }
        },
        {$match: hh},
        {$match: wh}
      ]

      db.collection('register').aggregate(aggregate).skip(skip).limit(perPage).toArray((err, alldata) => {
        aggregate.push({ $count: "total" });
        db.collection('register').aggregate(aggregate).toArray((err, userCount) => {
          if (userCount[0] == undefined) {
            userCount[0] = 0
          }
          data = {
            data: alldata
          }
          data['search'] = req.body;
          data['current'] = page;
          data['pages'] = Math.ceil(userCount[0].total / perPage);

          responseData('adminPanel/providerpage.html', data, res)
        })
      })
    })
    } else {
      res.redirect('/')
    }
  })


app.get('/giveph_rh/:_id', (req, res) => {
    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      db.collection('todaypin').find({visible: 0}).sort({ _id: 0 }).limit(1).sort({ _id: -1 }).toArray((err, mypin) => {
        if(mypin[0] != undefined){
        db.collection('pinHistory').findOne({ _id: objectId(req.params._id) }, (err, myoid) => {
          db.collection('pinHistory').findOne({User_id: { $nin: [objectId(myoid.User_id)] }, makeReceiver: 1 }, (err, oneitem) => {
            db.collection('pinHistory').findOne({User_id: { $nin: [objectId(myoid.User_id)] }, makeReceiver: 0 }, (err, newitem) => {

              if (oneitem) {
                var currentTimes = new Date()
                currentTimes.setUTCHours(currentTimes.getHours() + 5);
                currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
                var ph_rh = {
                  sender_id: objectId(myoid.User_id),
                  receiver_id: objectId(oneitem.User_id),
                  pin_amount: parseInt(mypin[0].pin_amount),
                  provider_amt: parseInt(mypin[0].provider_amt),
                  receiver_amt: parseInt(mypin[0].receiver_amt),
                  use: 0,
                  Tr_id: uniqid('Aa0', 12),
                  date: currentTimes
                }
                db.collection('phrh').insertOne(ph_rh)

                var query = { _id: objectId(oneitem._id) }
                var value = { $set: { makeReceiver: 2 } }
                db.collection('pinHistory').updateOne(query, value)

                var query1 = { _id: objectId(myoid._id) }
                var value1 = { $set: { use: 1 } }
                db.collection('pinHistory').updateOne(query1, value1)

                res.send({error: false, msg: ''})
              } else if (newitem) {
                var currentTimes = new Date()
                currentTimes.setUTCHours(currentTimes.getHours() + 5);
                currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
                var ph_rh = {
                  sender_id: objectId(myoid.User_id),
                  receiver_id: objectId(newitem.User_id),
                  pin_amount: parseInt(mypin[0].pin_amount),
                  provider_amt: parseInt(mypin[0].provider_amt),
                  receiver_amt: parseInt(mypin[0].receiver_amt),
                  use: 0,
                  Tr_id: uniqid('Aa0', 12),
                  date: currentTimes
                }
                db.collection('phrh').insertOne(ph_rh)

                var query = { _id: objectId(newitem._id) }
                var value = { $set: { makeReceiver: 1 } }
                db.collection('pinHistory').updateOne(query, value)

                var query1 = { _id: objectId(myoid._id) }
                var value1 = { $set: { use: 1 } }
                db.collection('pinHistory').updateOne(query1, value1)

                res.send({error: false, msg: ''})
              }else{
                res.send({error: true, msg: 'we not found any recever Id'})
              }
            })
          })
        })
      }else{
        res.send({error: true, msg: 'today pin not available'})
      }
      })

    } else {
      res.redirect('/')
    }
  })


  app.get('/getphrh/:value/:_id', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

    if(req.params.value == 'provider'){
   
      var aggregate = [
        {
          $lookup: {
            "from": "pinHistory",
            "localField": "_id",
            "foreignField": 'User_id',
            "as": "item"
          }
        },
        { $unwind: "$item" },
        { $match: { "item.use": 0 } },
        {
          "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "Mobile_no": { "$first": "$Mobile_no" },
            "walletBalance": { "$first": "$walletBalance" },
            "item": { "$push": "$item" }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            Mobile_no: 1,
            walletBalance: 1,
            pin: {
              $sum: "$item.pin_count"
            }
          }
        },
        { $match: { pin: { $gt: 0 } } },
        { $match: { _id: { $nin: [objectId(req.params._id)] } } }
      ]

      db.collection('register').aggregate(aggregate).toArray((err, alldata) => {
        return res.send(alldata);
      })
    }else if(req.params.value == 'receiver'){

      var aggregate = [
        {
          $lookup: {
            "from": "pinHistory",
            "localField": "_id",
            "foreignField": 'User_id',
            "as": "item"
          }
        },
        { $unwind: "$item" },
        { $match: { "item.use": 0 } },
        {
          "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "Mobile_no": { "$first": "$Mobile_no" },
            "walletBalance": { "$first": "$walletBalance" },
            "item": { "$push": "$item" }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            Mobile_no: 1,
            walletBalance: 1,
            pin: {
              $sum: "$item.pin_count"
            }
          }
        },
        { $match: { pin: { $gt: 0 } } },
        { $match: { _id: { $nin: [objectId(req.params._id)] } } },
      ]
      db.collection('register').aggregate(aggregate).toArray((err, alldata) => {
        var kk = []
        for(var i = 0; i < alldata.length; i++){
          kk.push(objectId(alldata[i]._id))
        }


        db.collection('phrh').find({sender_id: {$in: kk}, status: 1}).toArray((err2, mydatas) => {

          // var myrealdata = [];
          // for (var i = 0; i < alldata.length; i++) {
          //   for (var j = 0; j < mydatas.length; j++) {
          //     if ((alldata[i]._id).toString() == (mydatas[j].sender_id).toString()) {
          //       myrealdata.push(alldata[i])
          //     }
          //   }
          // }

          const result = alldata.filter(f =>
            mydatas.some(d => (d.sender_id).toString() == (f._id).toString())
          );

          return res.send(result);
        })
        
      })

    }else{
      return res.send([])
    }
    }else{
      return res.redirect('/');
    }
  })

 /* app.get('/ph_rh/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('register').find({ walletBalance: { $gt: 0}}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('register').countDocuments((err, userCount) => {
          var data = {
            data: alldata
          }

          data['search'] = {};
          data['current'] = page;
          data['pages'] = Math.ceil(userCount / perPage);

          responseData('adminPanel/providerpage.html', data, res)
        })

      })

    } else {

      res.redirect('/')

    }
  })*/



  /*  app.get('/ph_rh/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

    var perPage = 10;
    var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    var skip = (perPage * page) - perPage;
    var limit = "LIMIT " + skip + ", " + perPage;
    var aggregate = [{
      "$group": {
        "_id": null,
        "data": {
          "$push": {
            "artist": "$User_id"
          }
        }
      }
    }, {
      "$unwind": "$data"
    }, {
      "$group": {
        "_id": {
          "a": "$data.artist"
        }
      }
    }, {
      "$group": {
        "_id": null,
        "ArtistValues": {
          "$push": "$_id.a"
        }
      }
    }, {
      "$project": {
        "values": "$ArtistValues",
        "_id": 0
        }
      }]

    db.collection('pinHistory').aggregate(aggregate).toArray((err, alldata) => {
      // console.log(alldata[0].values)
      for (var i = 0; i < alldata[0].values.length; i++) {
        alldata[0].values[i] = objectId(alldata[0].values[i]);
      }

    db.collection('register').find({ _id: { $in: alldata[0].values } }).toArray((err, mydata) => {
      db.collection('register').countDocuments({_id: { $in: alldata[0].values }}, (err, userCount) => {

        for (var i = 0; i < alldata.length; i++) {
          if (alldata[i].date) {
            alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
          }
        }

        data = {
          data: mydata
        }

        // console.log(alldata[0].values)

        data['search'] = {};
        data['current'] = page;
        data['pages'] = Math.ceil(userCount / perPage);

        responseData('adminPanel/providerpage.html', data, res)
      })
    })
  })
  } else {
    res.redirect('/')
  }
})*/


  app.get('/ph_rh/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

       var aggregate = [

        {
          $lookup: {
            "from": "pinHistory",
            "localField": "_id",
            "foreignField": 'User_id',
            "as": "item"
          }
        },


        { $unwind: "$item" },

        { $match: { "item.use": 0 } },

        {
          "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "Mobile_no": { "$first": "$Mobile_no" },
            "walletBalance": { "$first": "$walletBalance" },
            "item": { "$push": "$item" }
          }
        },

        {
          $project: {
            _id: 1,
            name: 1,
            Mobile_no: 1,
            walletBalance: 1,
            pin: {
              $sum: "$item.pin_count"
            },
          }
        },

        { $match: { pin: { $gt: 0 } } },

        {
          $lookup: {
            "from": "phrh",
            "localField": "_id",
            "foreignField": 'sender_id',
            "as": "ph"
          }
        },

        {
          $lookup: {
            "from": "phrh",
            "localField": "_id",
            "foreignField": 'receiver_id',
            "as": "rh"
          }
        },

        {
          $project: {
            _id: 1,
            name: 1,
            Mobile_no: 1,
            walletBalance: 1,
            pin: 1,
            ph: {$size : '$ph'},
            rh: {$size : '$rh'},
          }
        }

      ]
      


      db.collection('register').aggregate(aggregate).skip(skip).limit(perPage).toArray((err, alldata) => {

       /* var count = [

          {
            $lookup: {
              "from": "pinHistory",
              "localField": "_id",
              "foreignField": 'User_id',
              "as": "item"
            }
          },

          { $unwind: "$item" },

          { $match: { "item.use": 0 } },

          {
            "$group": {
              "_id": "$_id",
              "name": { "$first": "$name" },
              "Mobile_no": { "$first": "$Mobile_no" },
              "walletBalance": { "$first": "$walletBalance" },
              "item": { "$push": "$item" }
            }
          },

          {
            $project: {
              _id: 1,
              name: 1,
              Mobile_no: 1,
              walletBalance: 1,
              pin: {
                $sum: "$item.pin_count"
              }
            }
          },

          { $match: { pin: { $gt: 0 } } },


          { $count: "total" }
        ]*/

        aggregate.push({ $count: "total" });

        db.collection('register').aggregate(aggregate).toArray((err, userCount) => {

          if(userCount[0] == undefined){
            userCount[0] = 0
          }

          data = {
            data: alldata
          }

          data['search'] = {};
          data['current'] = page;
          data['pages'] = Math.ceil(userCount[0].total / perPage);

          responseData('adminPanel/providerpage.html', data, res)
        })
      })
    } else {
      res.redirect('/')
    }
  })


app.post('/insertph_rh', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var data = req.body;
      var currentTimes = new Date()
        currentTimes.setUTCHours(currentTimes.getHours()+5);
        currentTimes.setUTCMinutes(currentTimes.getMinutes()+30);
        var ph_rh = {
          sender_id: objectId(data.sender_id),
          receiver_id: objectId(data.receiver_id),
          pin_amount: parseInt(data.pin_amount),
          provider_amt: parseInt(data.provider_amt),
          receiver_amt: parseInt(data.receiver_amt),
          use: 0,
          Tr_id: uniqid('Aa0', 12),
          date: currentTimes
        }

      var aggregate = [
        { $match: { User_id: objectId(ph_rh.sender_id), use: 0 } },
        { $sort: { _id: 1 } },
        { $limit: 1 }
      ]

      db.collection('pinHistory').aggregate(aggregate).toArray((err, result) => {
        if (result[0] == undefined) {
          return res.send({ error: true })
        } else {
          db.collection('pinHistory').updateOne({ _id: objectId(result[0]._id) }, { $set: { use: 1 } })
            db.collection('phrh').insertOne(ph_rh, (err, ress) => {
              res.redirect('/ph_rh/1')
            })
        }
      })
    } else {
      res.redirect('/')
    }
  })



app.post('/ph_rh/:page', (req, res) => {
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

  var aggregate = [

    {
      $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    {$unwind : "$item"},

    { $match: { "item.use": 0 } },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "date": {"$first": "$date"},
      "item": { "$push": "$item" }
   }},

    {
      $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: "$item.pin_count"
        },
        date: 1
      }
    },

    { $match: { pin: { $gt: 0} } },

    {
          $lookup: {
            "from": "phrh",
            "localField": "_id",
            "foreignField": 'sender_id',
            "as": "ph"
          }
        },

        {
          $lookup: {
            "from": "phrh",
            "localField": "_id",
            "foreignField": 'receiver_id',
            "as": "rh"
          }
        },

        {
          $project: {
            _id: 1,
            name: 1,
            Mobile_no: 1,
            walletBalance: 1,
            pin: 1,
            ph: {$size : '$ph'},
            rh: {$size : '$rh'},
          }
        },

    { $match: wh }
  ]

  var count = [

    {
      $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    {$unwind : "$item"},

    { $match: { "item.use": 0 } },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "date": {"$first": "$date"},
      "item": { "$push": "$item" }
   }},

    {
      $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: "$item.pin_count"
        },
        date: 1
      }
    },

    { $match: { pin: { $gt: 0} } },

    { $match: wh },

    { $count: 'total'}
  ]

    db.collection('register').aggregate(count).toArray((err, userCount) => {
      db.collection('register').aggregate(aggregate).skip(skip).limit(perPage).toArray((err, users) => {
        
        if(userCount[0] == undefined){
            userCount[0] = 0
          }       
        var data = {
          data: users,
        }
        data['search'] = req.body;
        data['current'] = page;
        data['pages'] = Math.ceil(userCount[0].total / perPage);
        responseData('adminPanel/providerpage.html', data, res);
      })
    })
  }
  else {
    res.redirect('/');
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

      wh['walletBalance'] = {$gt : 0}

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

      app.get('/blocklist/:page', (req, res) => {
        sess = req.session;

          if(sess.Mobile_no != undefined || sess.Mobile_no != null){

            var perPage = 10;
            var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
            var skip = (perPage * page) - perPage;
            var limit = "LIMIT " + skip + ", " + perPage;
            db.collection('register').find({block: 1}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {

              //console.log(alldata)
              db.collection('register').countDocuments({block: 'checked'},(err, userCount) => {

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
                responseData('adminPanel/blocklist.html', data, res)
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


app.get('/moneyTrHistory/:page', (req, res) => {
  sess = req.session;
  var perPage = 10;
  var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
  var skip = (perPage * page) - perPage;

  if (typeof sess.Mobile_no != 'undefined') {
    var aggregate = [{
      $lookup: {
        "from": "register",
        "localField": "sender_id",
        "foreignField": '_id',
        "as": "sender"
      }
    },
    {
      $lookup: {
        "from": "register",
        "localField": "receiver_id",
        "foreignField": '_id',
        "as": "receiver"
      }
    },
    {$unwind: '$sender'},
    {$unwind: '$receiver'},
    {
      $project: {
        _id: 1,
        sender_id: 1,
        sender_name: '$sender.name',
        sender_mobile: '$sender.Mobile_no',
        receiver_id: 1,
        receiver_name: '$receiver.name',
        receiver_mobile: '$receiver.Mobile_no',
        amount: 1,
        Tr_id: 1,
        date: 1,
      }
    },
    {$sort: {_id: -1}}
  ]
  db.collection('walletTransfer').aggregate(aggregate).toArray((err, userCount) => {
    db.collection('walletTransfer').aggregate(aggregate).skip(skip).limit(perPage).toArray((err, WTH) => {
      
        for (var i = 0; i < WTH.length; i++) {
          if (WTH[i].date) {
            WTH[i].date = _date(WTH[i].date).format('DD/MM/YYYY h:mm:ss a');
          }
        }
        if(typeof userCount[0] == 'undefined'){
          userCount[0] = 0
        }
        var data = {
          data: WTH
        }
        data['current'] = page;
        data['pages'] = Math.ceil(userCount.length / perPage);
        responseData('adminPanel/moneyTrHistory.html', data, res)
      })
    })
  }else{
    res.redirect('/');
  }
})


app.post('/pbp/:page', (req, res) => {
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

  var aggregate = [

    { $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    { "$unwind": { "path": "$item", "preserveNullAndEmptyArrays": true } },

   // { $match: { $or : [{ "item.use": 0 } ,{ "item": {$exists : false} }]} },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "date": { "$first": "$date"},
      "item": { "$push": "$item" } 
   }},

    { $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
        $sum: {
            "$size": {
              "$filter": {
                "input": "$item",
                "cond": { "$eq": ["$$this.use", 0] }
              }
            }
          }
        },
        date: 1
      }
    },

    { $match: wh }

  ]

  var count = [

    {
      $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    { "$unwind": { "path": "$item", "preserveNullAndEmptyArrays": true } },

   // { $match: { $or : [{ "item.use": 0 } ,{ "item": {$exists : false} }]} },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "date": { "$first": "$date"},
      "item": { "$push": "$item" }
   }},

    {
      $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: {
            "$size": {
              "$filter": {
                "input": "$item",
                "cond": { "$eq": ["$$this.use", 0] }
              }
            }
          }
        },
        date: 1
      }
    },

    { $match: wh },

    {$count: 'total'},
  ]

    db.collection('register').aggregate(count).toArray((err, userCount) => {
      db.collection('register').aggregate(aggregate).sort({_id: -1}).skip(skip).limit(perPage).toArray((err, users) => {
      if(userCount[0] == undefined){
            userCount[0] = 0
          } 
        var data = {
          data: users,
        }
        data['search'] = req.body;
        data['current'] = page;
        data['pages'] = Math.ceil(userCount[0].total / perPage);
        responseData('adminPanel/prebookingpin.html', data, res);
      })
    })
  }
  else {
    res.redirect('/');
  }
})


/*app.post('/pbp/:page', (req, res) => {
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

  var aggregate = [

    { $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    { "$unwind": { "path": "$item", "preserveNullAndEmptyArrays": true } },

    { $match: { $or : [{ "item.use": 0 } ,{ "item": {$exists : false} }]} },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "date": { "$first": "$date"},
      "item": { "$push": "$item" } 
   }},

    { $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: "$item.pin_count"
        },
        date: 1
      }
    },

    { $match: wh }

  ]

  var count = [

    {
      $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    { "$unwind": { "path": "$item", "preserveNullAndEmptyArrays": true } },

    { $match: { $or : [{ "item.use": 0 } ,{ "item": {$exists : false} }]} },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "date": { "$first": "$date"},
      "item": { "$push": "$item" }
   }},

    {
      $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: "$item.pin_count"
        },
        date: 1
      }
    },

    { $match: wh },

    {$count: 'total'},
  ]

    db.collection('register').aggregate(count).toArray((err, userCount) => {
      db.collection('register').aggregate(aggregate).sort({_id: -1}).skip(skip).limit(perPage).toArray((err, users) => {
       
        var data = {
          data: users,
        }
        data['search'] = req.body;
        data['current'] = page;
        data['pages'] = Math.ceil(userCount[0].total / perPage);
        responseData('adminPanel/prebookingpin.html', data, res);
      })
    })
  }
  else {
    res.redirect('/');
  }
})



app.post('/pbp/:page', (req, res) => {
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
        responseData('adminPanel/prebookingpin.html', data, res);
      })
    })
  }
  else {
    res.redirect('/');
  }
})


app.get('/pbp/:page', (req, res) => {
  sess = req.session;
  var perPage = 10;
  var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
  var skip = (perPage * page) - perPage;
  var limit = "LIMIT " + skip + ", " + perPage;

  if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

    db.collection('register').countDocuments((err, userCount) => {
      db.collection('register').find({}).skip(skip).limit(perPage).toArray((err, users) => {
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
        responseData('adminPanel/prebookingpin.html', data, res);
      })
    })
  }
  else {
    res.redirect('/');
  }
})
*/



app.get('/pbp/:page', (req, res) => {
  sess = req.session;
  var perPage = 10;
  var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
  var skip = (perPage * page) - perPage;
  var limit = "LIMIT " + skip + ", " + perPage;

  if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

  var aggregate = [

    { $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    { "$unwind": { "path": "$item", "preserveNullAndEmptyArrays": true } },

   // { $match: { $or : [{ "item.use": 0 } ,{ "item": {$exists : false} }]} },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "item": { "$push": "$item" } 
   }},

    { $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: {
            "$size": {
              "$filter": {
                "input": "$item",
                "cond": { "$eq": ["$$this.use", 0] }
              }
            }
          }
        }
      }
    },

  ]

  var count = [

    {
      $lookup: {
        "from": "pinHistory",
        "localField": "_id",
        "foreignField": 'User_id',
        "as": "item"
      }
    },

    { "$unwind": { "path": "$item", "preserveNullAndEmptyArrays": true } },

   // { $match: { $or : [{ "item.use": 0 } ,{ "item": {$exists : false} }]} },

    { "$group": {
      "_id": "$_id",
      "name": { "$first": "$name" },
      "Mobile_no": { "$first": "$Mobile_no" },
      "walletBalance": { "$first": "$walletBalance" },
      "item": { "$push": "$item" }
   }},

    {
      $project: {
        _id: 1,
        name: 1,
        Mobile_no: 1,
        walletBalance: 1,
        pin: {
          $sum: {
            "$size": {
              "$filter": {
                "input": "$item",
                "cond": { "$eq": ["$$this.use", 0] }
              }
            }
          }
        }
      }
    },

    {$count: 'total'}
  ]

    db.collection('register').aggregate(count).toArray((err, userCount) => {
      db.collection('register').aggregate(aggregate).sort({_id: -1}).skip(skip).limit(perPage).toArray((err, users) => {
       if(userCount[0] == undefined){
            userCount[0] = 0
          }
        var data = {
          data: users,
        }
        data['search'] = req.body;
        data['current'] = page;
        data['pages'] = Math.ceil(userCount[0].total / perPage);
        
        responseData('adminPanel/prebookingpin.html', data, res);
      })
    })
  } else {
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



     app.get('/shareData', (req, res) => {
        sess = req. session; 
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){
          db.collection('sharedata').find({}).sort({_id: -1}).limit(1).toArray((err, lastdata) => {
          
          var data= {
            err: false,
            data: lastdata
          }
          responseData('adminPanel/sharedata.html', data, res)
        })
        }else{
          res.redirect('/')
        }
      })

      app.post('/sharedata', (req, res) => {
        sess = req. session; 
        if(sess.Mobile_no != undefined || sess.Mobile_no != null){
        var currentTimes = new Date()
        currentTimes.setUTCHours(currentTimes.getHours()+5);
        currentTimes.setUTCMinutes(currentTimes.getMinutes()+30);
          var data = req.body;
          var insert = {
            news: data.news,
            youtube: data.youtube,
            share: data.share,
            facebook: data.facebook,
            whatsapp: data.whatsapp,
            instagram: data.instagram,
            blog: data.blog,
            date: currentTimes
          }
          db.collection('sharedata').insertOne(insert, (err, result) => {
            res.redirect('/shareData')
          })
        }else{
          res.redirect('/')
        }
      })

  app.get('/rh_link/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('ph_link').find({ status: 0 }).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('ph_link').countDocuments({ status: 0 }, (err, userCount) => {

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
    } else {
      res.redirect('/')
    }
  })

    app.get('/amountaddhistory/:page', (req, res) => {
      sess = req.session;

        if(sess.Mobile_no != undefined || sess.Mobile_no != null){

          var perPage = 10;
          var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
          var skip = (perPage * page) - perPage;
          var limit = "LIMIT " + skip + ", " + perPage;

     aggregate = [

    {
      $lookup: {
        from: "register",
        localField: "User_id",
        foreignField: "_id",
        as: "item"}
    }, 
    
    { $unwind: '$item' },

    { $project: {
      _id: 1,
      User_id: '$User_id',
      name : '$item.name',
      Mobile_no: '$item.Mobile_no',
      amount: '$amount',
      addby: '$addby',
      tr_id: '$tr_id',
      date: '$date'
    }}
  ]
          db.collection('walletHistory').aggregate(aggregate).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
            var mytotal = [{
              $lookup: {
                from: "register",
                localField: "User_id",
                foreignField: "_id",
                as: "item"
              }
            },
      
            { $unwind: '$item' },
      
            {
              $project: {
                _id: 1,
                User_id: '$User_id',
                name: '$item.name',
                Mobile_no: '$item.Mobile_no',
                amount: '$amount',
                addby: '$addby',
                tr_id: '$tr_id',
                date: '$date'
              }
            },
          {$count: 'total'}]
         db.collection('walletHistory').aggregate(mytotal).toArray((err, userCount) => {
        
              if(userCount[0] == undefined){
            userCount[0] = 0
          } 
      
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
              data['pages'] = Math.ceil(userCount[0].total / perPage);
      
              responseData('adminPanel/admin_add_amount_history.html', data, res)
              //res.send(userCount)
            })
          })

        }else{
          res.redirect('/')
        }
    })

    app.post('/amountaddhistory/:page', (req, res) => {
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

              aggregate = [

      {
        $lookup: {
          from: "register",
          localField: "User_id",
          foreignField: "_id",
          as: "item"}
      }, 
      
      { $unwind: '$item' },
  
      { $project: {
        _id: 1,
        User_id: '$User_id',
        name : '$item.name',
        Mobile_no: '$item.Mobile_no',
        amount: '$amount',
        addby: '$addby',
        tr_id: '$tr_id',
        date: '$date'
      }},

      {$match: wh},
     ]


      var totalc = [

      {
        $lookup: {
          from: "register",
          localField: "User_id",
          foreignField: "_id",
          as: "item"}
      },

      { $unwind: '$item' },

      { $project: {
        _id: 1,
        User_id: '$User_id',
        name : '$item.name',
        Mobile_no: '$item.Mobile_no',
        amount: '$amount',
        addby: '$addby',
        tr_id: '$tr_id',
        date: '$date'
      }},

      {$match: wh},
    {$count: 'total'}]
          
          db.collection('walletHistory').aggregate(totalc).toArray((err, userCount) => {
              db.collection('walletHistory').aggregate(aggregate).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, users) => {
                db.collection('register').find({}).toArray((err, mycoll) => {
                
                  if(userCount[0] == undefined){
            userCount[0] = 0
          }

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
                  data['pages'] = Math.ceil(userCount[0].total / perPage);
                  responseData('adminPanel/admin_add_amount_history.html', data, res);
                })
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

  app.get('/rh_link/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('ph_link').find({ status: 0 }).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('ph_link').countDocuments({ status: 0 }, (err, userCount) => {

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
    } else {
      res.redirect('/')
    }
  })




 /* app.get('/userwallet/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var collectionName = 'register';
      var pagePath = 'adminPanel/userwallet.html';
      var data = {
        error: false
      }
      pagination(collectionName, pagePath, res, req, data)

    } else {
      res.redirect('/')
    }
  })*/


    app.get('/userwallet/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('register').find({}).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('register').countDocuments((err, userCount) => {

          var aggregate = [
            { $match: { walletBalance: { $gt: 0 } } },
            { $project: { _id: 0, 'ww': '$walletBalance', } },
            { $group: { _id: 0, cart_total: { $sum: "$ww" }, } }

          ]

          db.collection('register').aggregate(aggregate).toArray((err, allBalances) => {

            if(allBalances[0] == undefined){
              allBalances[0] = 0
            }

            for (var i = 0; i < alldata.length; i++) {
              if (alldata[i].date) {
                alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
              }
            }

            data = {
              data: alldata
            }
            data['allBalance'] = allBalances[0].cart_total
            data['search'] = {};
            data['current'] = page;
            data['pages'] = Math.ceil(userCount / perPage);


            responseData('adminPanel/userwallet.html', data, res)
          })
        })
      })

    } else {
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
          var aggregate = [
            { $match: { walletBalance: { $gt: 0 } } },
            { $project: { _id: 0, 'ww': '$walletBalance', } },
            { $group: { _id: 0, cart_total: { $sum: "$ww" }, } }

          ]

          db.collection('register').aggregate(aggregate).toArray((err, allBalances) => {
          if(allBalances[0] == undefined){
              allBalances[0] = 0
            }
           for (var i = 0; i < users.length; i++) {
            if (users[i].date) {
              users[i].date = _date(users[i].date).format('DD/MM/YYYY h:mm:ss a');
            }
          }
          var data = {
            data: users,
            error: false
          }
          data['allBalance'] = allBalances[0].cart_total
          data['search'] = req.body;
          data['current'] = page;
          data['pages'] = Math.ceil(userCount / perPage);
          responseData('adminPanel/userwallet.html', data, res);
        })
        })
      })
    }
    else {
      res.redirect('/');
    }
  })


  app.post('/getwalletAmount', (req, res) => {
    var data = req.body
    db.collection('register').findOne({ _id: objectId(data._id) }, (err, mydata) => {
      res.send({ data: mydata })
    })
  })


app.post('/addpinbyadmin', (req, res) => {
    var data = req.body;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
      if (parseInt(data.pin) == 0) {
        return res.send({ error: true, data: 'Please Insert 1 or More Pin' })
      }
      db.collection('todaypin').find({ visible: 0 }).sort({ _id: -1 }).toArray((err1, todaypin) => {

        if (typeof todaypin[0] != 'undefined') {

          if (!(data.pin > todaypin[0].available_pin)) {
            db.collection('todaypin').updateOne({ visible: 0 }, { $inc: { available_pin: -parseInt(data.pin), sold_pin: +parseInt(data.pin) } })

            for (var i = 0; i < parseInt(data.pin); i++) {
             var currentTimes = new Date()
          currentTimes.setUTCHours(currentTimes.getHours() + 5);
          currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
              var adminpin = {
                User_id: objectId(data._id),
                amount: todaypin[0].pin_amount,
                pin_count: 1,
                use: 0,
                makeReceiver: 0, 
                pin_id: todaypin[0].pin_uniqid,
                Tr_id: uniqid('Aa0', 12),
                date: currentTimes
              }
              db.collection('pinHistory').insertOne(adminpin)
              if (parseInt(data.pin) == i + 1) {
                return res.send({ error: false })
              }
            }
          } else {
            return res.send({ error: true, data: 'only ' + todaypin[0].available_pin + ' avilable Pin' })
          }
        } else {
          return res.send({ error: true, data: 'today pin not available' })
        }
      })
    } else {
      res.redirect('/admin');
    }

  })


/*app.post('/addpinbyadmin', (req, res) => {
    var data = req.body;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
      if (parseInt(data.pin) == 0) {
        return res.send({ error: true, data: 'Please Insert 1 or More Pin' })
      }
      db.collection('todaypin').find({ visible: 0 }).sort({ _id: -1 }).toArray((err1, todaypin) => {

        if (typeof todaypin[0] != 'undefined') {
          for (var i = 0; i < parseInt(data.pin); i++) {
            var adminpin = {
              User_id: objectId(data._id),
              amount: todaypin[0].pin_amount,
              pin_count: 1,
              use: 0,
              Tr_id: uniqid('Aa0', 12),
              date: new Date()
            }
            db.collection('pinHistory').insertOne(adminpin)
            if (parseInt(data.pin) == i + 1) {
              return res.send({ error: false })
            }
          }
        } else {
          return res.send({ error: true, data: 'today pin not available' })
        }
      })
    } else {
      res.redirect('/admin');
    }

  })
   app.post('/updatewalletbyadmin', (req, res) => {
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

     // db.collection('register').findOne({ _id: objectId(req.body._id) }, (err3, indata) => {
        var currentTime = new Date();
            currentTime.setUTCHours(currentTime.getHours()+5);
            currentTime.setUTCMinutes(currentTime.getMinutes()+30);
        var data = req.body;
        var mydata = {
          User_id: objectId(data._id),
         /* name: indata.name,
          Mobile_no: indata.Mobile_no,*/
          amount: data.price + data.amount,
          addby: 1,
          tr_id: uniqid('Aa0', 12),
          date: currentTime
        }

        if ('+' == data.price) {

          var query = { _id: objectId(data._id) };
          var data = { $inc: { walletBalance: +parseInt(data.amount) } }

          db.collection('register').updateMany(query, data, function (err, result2) {
            db.collection('walletHistory').insertOne(mydata, (err2, mycoll) => {
              res.send({ error: false })
            })
          })

        } else if ('-' == data.price) {
          var query = { _id: objectId(data._id) };
          var data = { $inc: { walletBalance: -parseInt(data.amount) } }

          db.collection('register').updateMany(query, data, function (err, result2) {
            db.collection('walletHistory').insertOne(mydata, (err2, mycoll) => {
              res.send({ error: false })
            })
          })
        }

     // })

    } else {
      res.redirect('/admin');
    }
  })






  app.get('/get_pl/:_id', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      if (!objectId.isValid(req.params._id)) {
        return res.redirect('/ph_link/1')
      }

          var aggregate = [
      {
        $lookup: {
          "from": "pinHistory",
          "localField": "_id",
          "foreignField": 'User_id',
          "as": "item"
        }
      },
      { $unwind: "$item" },
      { $match: { "item.use": 0 } },
      {
        "$group": {
          "_id": "$_id",
          "name": { "$first": "$name" },
          "Mobile_no": { "$first": "$Mobile_no" },
          "walletBalance": { "$first": "$walletBalance" },
          "item": { "$push": "$item" }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          Mobile_no: 1,
          walletBalance: 1,
          pin: {
            $sum: "$item.pin_count"
          }
        }
      },
      { $match: { pin: { $gt: 0 } } },
      { $match: { _id: { $nin: [objectId(req.params._id)] } } }
    ]

      db.collection('register').findOne({ _id: objectId(req.params._id) }, (err, result) => {
        db.collection('register').aggregate(aggregate).toArray((err2, myres) => {

        var data = {
          data: result,
          receiver: myres
        }

        responseData('adminPanel/inproviderdata.html', data, res)
        })
      })

    } else {

      res.redirect('/')

    }
  })

  app.get('/userlist/:page', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var collectionName = 'register';
      var pagePath = 'adminPanel/userlist.html';
      var data = {
        error: false
      }
      pagination(collectionName, pagePath, res, req, data)

    } else {
      res.redirect('/')
    }
  })

  app.get('/userdata/:_id', (req, res) => {
    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      if (!objectId.isValid(req.params._id)) {
         return res.redirect('/userlist/1')
      }

      db.collection('register').findOne({ _id: objectId(req.params._id) }, (err1, register) => {
        if(register == undefined && register == null){
               return res.redirect('/userlist/1')
             }
        db.collection('phrh').countDocuments({ sender_id: objectId(req.params._id) }, (err2, phcount) => {
          db.collection('phrh').countDocuments({ receiver_id: objectId(req.params._id) }, (err3, rhcount) => {
            db.collection('pinHistory').find({ User_id: objectId(req.params._id) }).sort({ _id: -1 }).toArray((err4, phistory) => {
              db.collection('walletTransfer').find({ sender_id: objectId(req.params._id) }).sort({ _id: -1 }).toArray((err4, wt) => {
                db.collection('walletTransfer').find({ receiver_id: objectId(req.params._id)}).sort({ _id: -1 }).toArray((err4, ri) => {
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

                for (var i = 0; i < ri.length; i++) {
                  if (ri[i].date) {
                    ri[i].date = _date(ri[i].date).format('DD/MM/YYYY h:mm:ss a');
                  }
                }

                var data = {
                  userdetail: register,
                  phcount: phcount,
                  rhcount: rhcount,
                  pinhistory: phistory,
                  walletTransfer: wt,
                  receive_amt: ri 
                }

                responseData('adminPanel/userdetail.html', data, res)
                })
              })
            })
          })
        })
      })
    } else {
      res.redirect('/')
    }
  })

  app.get('/block/:_id', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
      db.collection("register").findOne({ _id: objectId(req.params._id) }, (err, result) => {
        if (result.block == 1) {
          var item = {
            block: 0,
          };
          db.collection('register').updateOne({ _id: objectId(req.params._id) }, { $set: item })
        } else {
          var item = {
            block: 1,
          };
          db.collection('register').updateOne({ _id: objectId(req.params._id) }, { $set: item })
        }
      })
    }
  })
  app.get('/get_rl/:_id', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      if (!objectId.isValid(req.params._id)) {
        return res.redirect('/rh_link/1')
      }

      db.collection('register').findOne({ _id: objectId(req.params._id) }, (err, result) => {
        
        if(!result){
           return res.redirect('/rh_link/1')
        }

        db.collection('ph_link').find({ User_ID: { $nin: [req.params._id] }, status: 0 }).toArray((err2, status) => {

          for (var i = 0; i < status.length; i++) {
            status[i].date = _date(status[i].date).format('DD/MM/YYYY');
          }
          var data = {
            results: result,
            statuss: status
          }
          responseData('adminPanel/inreceiverdata.html', data, res)
        })

      })

    } else {
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

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var data = req.body;
      var queryzero = { visible: 0 }
      var querytwo = { visible: 2 }
      var value = { $set: { visible: 1 } }

      db.collection('todaypin').updateMany(queryzero, value, (err1, visibility) => {
       db.collection('todaypin').updateMany(querytwo, value, (err1, nooooo) => {
       /* var addpin = {
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
        } */

        var currentTimes = new Date()
        currentTimes.setUTCHours(currentTimes.getHours()+5);
        currentTimes.setUTCMinutes(currentTimes.getMinutes()+30);
      //  var timeDiff = data.fromdate - currentTimes;

        var addpin = {
        total_pin: parseInt(data.total_pin),
        sold_pin: 0,
        starttime: new Date(data.fromdate),
        endtime: new Date(data.todate),
        available_pin: parseInt(data.total_pin),
        pin_amount: parseInt(data.pin_amount),
        provider_amt: parseInt(data.provider_amt),
        receiver_amt: parseInt(data.receiver_amt),
        visible: 2,
        pin_uniqid: uniqid('A0', 10),
        date: currentTimes
      }

        db.collection('todaypin').insertOne(addpin, (err2, insertsucess) => {
         
         // callbeforeTime(new Date(data.fromdate), data.total_pin, data.fromdate, data.todate, data.total_pin, data.pin_amount, data.provider_amt, data.receiver_amt)
          myTime(removetimes)
          callbeforeTime(new Date(data.fromdate))
          clearTimeouts(removetimer)
          callaftetTime(new Date(data.fromdate), new Date(data.todate));
          res.redirect('/dashboard')
        })

      })
    })

    } else {

      res.redirect('/')

    }
  })


/*  app.post('/insertph_link', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var data = req.body;
var currentTime = new Date();
    currentTime.setUTCHours(currentTime.getHours()+5);
    currentTime.setUTCMinutes(currentTime.getMinutes()+30);
      var ph_link = {
        User_ID: data._id,
        name: data.name,
        Mobile_no: data.Mobile_no,
        pin_amount: parseInt(data.pin_amount),
        provider_amt: parseInt(data.provider_amt),
        receiver_amt: parseInt(data.receiver_amt),
        use: 0,
        status: 0,
        Tr_id: uniqid('Aa0', 12),
        date: currentTime
      }

      db.collection('ph_link').insertOne(ph_link)

      res.redirect('/ph_link/1')

    } else {

      res.redirect('/')

    }
  })




app.post('/insertph_link', (req, res) => {
  sess = req.session;

  if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

    var data = req.body;

    var ph_rh = {
      User_id: objectId(data._id),
      pin_amount: parseInt(data.pin_amount),
      provider_amt: parseInt(data.provider_amt),
      receiver_amt: parseInt(data.receiver_amt),
      use: 0,
      status: 0,
      Tr_id: uniqid('Aa0', 12),
      date: new Date()
    }

    if(req.body.phrh == 'provider'){
      db.collection('ph_link').insertOne(ph_rh, (err, ress) => {
        res.redirect('/ph_rh/1')
      })
    }else if(req.body.phrh == 'receiver'){
      db.collection('rh_link').insertOne(ph_rh, (err, ress) => {
        res.redirect('/ph_rh/1')
      })
    }else{
      res.send({error: true, msg: 'data not inserted... please try again.'})
    }

  } else {

    res.redirect('/')

  }
})
*/



app.post('/insertph_link', (req, res) => {
  sess = req.session;

  if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

    var data = req.body;
    var currentTime = new Date();
    currentTime.setUTCHours(currentTime.getHours()+5);
    currentTime.setUTCMinutes(currentTime.getMinutes()+30);
    var ph_rh = {
      User_id: objectId(data._id),
      pin_amount: parseInt(data.pin_amount),
      provider_amt: parseInt(data.provider_amt),
      receiver_amt: parseInt(data.receiver_amt),
      use: 0,
      status: 0,
      Tr_id: uniqid('Aa0', 12),
      date: currentTime
    }

    var aggregate= [
      {$match: {User_id: objectId(data._id), use: 0}},
      {$sort: {_id: 1}},
      {$limit: 1}
    ]

    db.collection('pinHistory').aggregate(aggregate).toArray((err, result) => {
      if(result[0] == undefined){
        return res.send({error: true})
      }else{
        db.collection('pinHistory').updateOne({_id: objectId(result[0]._id)}, {$set: {use: 1}})

        if(req.body.phrh == 'provider'){
          db.collection('ph_link').insertOne(ph_rh, (err, ress) => {
            res.redirect('/ph_rh/1')
          })
        }else if(req.body.phrh == 'receiver'){
          db.collection('rh_link').insertOne(ph_rh, (err, ress) => {
            res.redirect('/ph_rh/1')
          })
        }else{
          return res.send({error: true, msg: 'data not inserted... please try again.'})
        }
      }
    })
    
  } else {
    res.redirect('/')
  }
})



  app.post('/insertrh_link', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var data = req.body;
      db.collection('ph_link').findOne({ Tr_id: data.Tr_id }, (err1, getsenderId) => {
        var currentTime = new Date();
            currentTime.setUTCHours(currentTime.getHours()+5);
            currentTime.setUTCMinutes(currentTime.getMinutes()+30);
        
        var ph_link = {
         /* sender_id: getsenderId.User_ID,
          receiver_id: data._id,*/
          sender_id: data._id,
          receiver_id: getsenderId.User_ID,
          name: data.name,
          Mobile_no: data.Mobile_no,
          pin_amount: parseInt(data.pin_amount),
          use: 0,
          Tr_id: uniqid('Aa0', 12),
          date: currentTime
        }

        db.collection('ph_link').updateOne({ Tr_id: data.Tr_id }, { $set: { status: 1 } })
        db.collection('rh_link').insertOne(ph_link)
        res.redirect('/rh_link/1')
      })

    } else {
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



  function callaftetTime(startDate, endDate) {

    var currentTimes = new Date()
    currentTimes.setUTCHours(currentTimes.getHours() + 5);
    currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
    var timeDiff = endDate - currentTimes;
   // console.log(timeDiff, '111')

    removetimer = setTimeout(() => {
      db.collection('todaypin').updateMany({ visible: 0 }, { $set: { visible: 1 } })

    }, timeDiff);
  }

  function clearTimeouts() {
    clearTimeout(removetimer);
  }

  function myTime() {
    clearTimeout(removetimes);
  }

  function callbeforeTime(startDate){
      //  console.log(fromdate, 'fromdate')
      //  console.log(todate, 'todate')
        var currentTimes = new Date()
       // console.log(currentTimes, 'current')
        currentTimes.setUTCHours(currentTimes.getHours()+5);
        currentTimes.setUTCMinutes(currentTimes.getMinutes()+30);
        var timeDiff = startDate - currentTimes;
       // console.log(timeDiff, '222')
       // console.log(currentTime, 'currenttimes')
       removetimes = setTimeout(() => {
   
        db.collection('todaypin').updateMany({ visible: 2 }, { $set: { visible: 0 } })

        /*  var addpin = {
            total_pin: parseInt(total_pin),
            sold_pin: 0,
            starttime: new Date(fromdate),
            endtime: new Date(todate),
            available_pin: parseInt(total_pin),
            pin_amount: parseInt(pin_amount),
            provider_amt: parseInt(provider_amt),
            receiver_amt: parseInt(receiver_amt),
            visible: 0,
            date: currentTimes
          }
          
          db.collection('todaypin').insertOne(addpin) */

        }, timeDiff);
      }


  app.get('/History', (req, res) => {
    sess = req.session;

    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
      responseData('adminPanel/history.html', { error: false }, res);
    } else {
      res.redirect('/');
    }
  })

  app.get('/phhistory/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

    var perPage = 10;
    var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    var skip = (perPage * page) - perPage;
    var limit = "LIMIT " + skip + ", " + perPage;

    aggregate = [

      {
        $lookup: {
          from: "register",
          localField: "User_id",
          foreignField: "_id",
          as: "item"}
      },

      { $unwind: '$item' },

      { $project: {
        _id: 1,
        User_id: '$User_id',
        name : '$item.name',
        Mobile_no: '$item.Mobile_no',
        pin_amount: '$pin_amount',
        provider_amt: '$provider_amt',
        receiver_amt: '$receiver_amt',
        Tr_id: '$Tr_id',
        date: '$date'
      }}
    ]



    db.collection('ph_link').aggregate(aggregate).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
      db.collection('ph_link').countDocuments((err, userCount) => {


        for (var i = 0; i < alldata.length; i++) {
          if (alldata[i].date) {
            alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
          }
        }

        data = {
          ph_date: '',
          data: alldata
        }

        data['search'] = {};
        data['current'] = page;
        data['pages'] = Math.ceil(userCount / perPage);

        responseData('adminPanel/phhistory.html', data, res)

      })
    })
    } else {
      res.redirect('/');
    }
  })


  app.get('/rhhistory/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {
    
    var perPage = 10;
    var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
    var skip = (perPage * page) - perPage;
    var limit = "LIMIT " + skip + ", " + perPage;

  /*  aggregate = [

      {
        $lookup: {
          from: "register",
          localField: "User_id",
          foreignField: "_id",
          as: "item"}
      }, 
      
      { $unwind: '$item' },
  
      { $project: {
        _id: 1,
        User_id: '$User_id',
        name : '$item.name',
        Mobile_no: '$item.Mobile_no',
        pin_amount: '$pin_amount',
        Tr_id: '$Tr_id',
        date: '$date'
      }}
    ]*/


    aggregate = [

      {
        $lookup: {
          from: "register",
          localField: "sender_id",
          foreignField: "_id",
          as: "sender"}
      }, 

      {
        $lookup: {
          from: "register",
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiver"}
      }, 
      
      { $unwind: '$sender' },
      { $unwind: '$receiver' },

      { $project: {
        _id: 1,
        sender_id: '$sender_id',
        receiver_id: '$receiver_id',
        sender_name: '$sender.name',
        receiver_name: '$receiver.name',
        pin_amount: '$pin_amount',
        provider_amt: '$provider_amt',
        receiver_amt: '$receiver_amt',
        use: '$use',
        Tr_id: '$Tr_id',
        date: '$date'
      }}
    ]



    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
      db.collection('phrh').countDocuments((err, userCount) => {


        for (var i = 0; i < alldata.length; i++) {
          if (alldata[i].date) {
            alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
          }
        }

        data = {
         // ph_date: '',
          data: alldata
        }

        data['search'] = {};
        data['current'] = page;
        data['pages'] = Math.ceil(userCount / perPage);

        responseData('adminPanel/rhhistory.html', data, res)

      })
    })
    } else {
      res.redirect('/');
    }
  })


  app.get('/addpinhistory/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var collectionName = 'todaypin';
      var pagePath = 'adminPanel/addpinhistory.html';
      var data = {
        error: false
      }
      pagination(collectionName, pagePath, res, req, data)

    } else {
      res.redirect('/');
    }
  })


 /* app.get('/purchasePinHistory/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

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
            for (var i = 0; i < alldata.length; i++) {
              for (var j = 0; j < register.length; j++) {
                if (alldata[i].User_id == register[j]._id) {
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

            responseData('adminPanel/purchasePinHistory.html', data, res)
          })
        })
      })
    } else {
      res.redirect('/');
    }
  })*/


app.get('/purchasePinHistory/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;

      aggregate = [

        {
          $lookup: {
            from: "register",
            localField: "User_id",
            foreignField: "_id",
            as: "item"
          }
        },

        { $unwind: '$item' },

        {
          $project: {
            _id: 1,
            User_id: '$User_id',
            name: '$item.name',
            mobile: '$item.Mobile_no',
            amount: '$amount',
            pin_count: '$pin_count',
            Tr_id: '$Tr_id',
            date: '$date'
          }
        }
      ]


      db.collection('pinHistory').aggregate(aggregate).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('pinHistory').countDocuments((err, userCount) => {
          for (var i = 0; i < alldata.length; i++) {
            alldata[i].date = _date(alldata[i].date).format('DD/MM/YYYY h:mm:ss a');
          }

          var data = {
            data: alldata
          }

          data['search'] = {};
          data['current'] = page;
          data['pages'] = Math.ceil(userCount / perPage);

          responseData('adminPanel/purchasePinHistory.html', data, res)
        })
      })
    } else {
      res.redirect('/');
    }
  })



  app.get('/cAmountHistory/:page', (req, res) => {

    sess = req.session;
    if (sess.Mobile_no != undefined || sess.Mobile_no != null) {

      var perPage = 10;
      var page = (typeof req.params.page != 'undefined') ? (req.params.page == 0) ? 1 : req.params.page || 1 : 1;
      var skip = (perPage * page) - perPage;
      var limit = "LIMIT " + skip + ", " + perPage;
      db.collection('rh_link').find({ use: 1 }).sort({ _id: -1 }).skip(skip).limit(perPage).toArray((err, alldata) => {
        db.collection('rh_link').countDocuments({ use: 1 }, (err, userCount) => {
          var data = {
            data: alldata
          }

          data['search'] = {};
          data['current'] = page;
          data['pages'] = Math.ceil(userCount / perPage);

          responseData('adminPanel/cAmountHistory.html', data, res)
        })
      })
    } else {
      res.redirect('/');
    }
  })


app.use( (req, res) => {
        res.send('<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Error 404, Page Not Found</h1></div></div>')
      })

})
