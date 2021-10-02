var express        = require('express')
    ejs            = require('ejs')
    path           = require('path')
    bodyParser     = require('body-parser')
    MongoClient    = require('mongodb').MongoClient
    objectId       = require('mongodb').ObjectID
    session        = require('express-session')
    assets         = require('assert')
    uniqid         = require('randomatic')
    app            = express()
    _date          = require('moment')
    config         = require('./config/config.json')
    port           = config.adminport
    dbName         = config.mongodb.dbname
    verson         = config.verson
    webModel       = module.exports = require('./model/adminmodel.js')
    url            = 'mongodb://'+config.mongodb.username+':'+config.mongodb.password+'@'+config.mongodb.host+':'+config.mongodb.port+'/'+config.mongodb.dbname
    BaseUrl        = 'http://'+config.mongodb.host +':'+ port
   // BaseUrl        = 'http://localhost:'+port
    
    var removetimer, removetimes

    removetimer = module.exports = removetimer
    removetimes = module.exports = removetimes

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
  db = module.exports = client.db(dbName);
  console.log("mongodb is connected with database =", dbName)



  db.collection('todaypin').find({ visible: 0 }).sort({ _id: -1 }).toArray((err, mypin) => {
    webModel.clearTimeouts(removetimer)
    if (mypin[0] != undefined) {
      console.log(mypin[0].starttime)
      webModel.callaftetTime(new Date(mypin[0].starttime), new Date(mypin[0].endtime));
    }
  })

  db.collection('todaypin').find({ visible: 2 }).sort({ _id: -1 }).toArray((err, mypin) => {
    webModel.myTime(removetimes)
    if (mypin[0] != undefined) {
      console.log(mypin[0].starttime)
      webModel.callbeforeTime(new Date(mypin[0].starttime));
    }
  })

  webModel.adminHandler()

  app.use((req, res) => {
    res.send('<style>*{transition:all .6s}html{height:100%}body{font-family:Lato,sans-serif;color:#888;margin:0}#main{display:table;width:100%;height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style><div id="main"><div class="fof"><h1>Error 404, Page Not Found</h1></div></div>')
  })

})

server = app.listen(port, () => {
  console.log("We Are Live On " + port)
})
