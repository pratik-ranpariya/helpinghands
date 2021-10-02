var express          = require('express')
    bodyParser       = require('body-parser')
    MongoClient      = require('mongodb').MongoClient
    objectId         = require('mongodb').ObjectID
    assets           = require('assert')
    multer           = require('multer')
    bcrypt           = require('bcryptjs')
    uniqid           = require('randomatic')
    _req             = require('request')
    helmet           = require('helmet')
    app              = express()
    config           = require('./config/config.json')
    verson           = config.verson
    port             = config.serverport
    dbName           = config.mongodb.dbname
    upload           = multer()
    otpJson          = []
    saltRounds       = 10
    RestApi          = module.exports = require('./model/servermodel.js')
    url              = 'mongodb://'+config.mongodb.username+':'+config.mongodb.password+'@'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.dbname
    BaseUrl          = 'http://'+config.mongodb.host +':'+ port +'/'+ verson

    app.use(helmet())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    
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
  db = module.exports = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)

  RestApi.myapi();

})



const server = app.listen(port, () => {
  console.log("We Are Live On " + port)
})
