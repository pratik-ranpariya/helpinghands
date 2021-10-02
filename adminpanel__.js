var session = require('express-session');
var express = require('express');
const app = express();
var http = require('http');
var ejs = require('ejs');
var path = require('path');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var helmet = require('helmet');
var uniqid = require('randomatic');
var fs = require('fs');
var port = '4000';

var dblink = 'mongodb://halpingHands:HalpingIsGood@13.235.148.218:53584/helpinghands';
var dbName ="helpinghands";


// var BaseUrl = 'http://localhost:'+port;
var BaseUrl = 'http://13.235.148.218:'+port;


// console.log(CN[1])


app.use(session({ secret: 'ssshhhhh', resave: true, saveUninitialized: true }));

app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


app.use(express.static('views'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(helmet());


var server = app.listen(port, () => { //"192.168.0.106"
    console.log("We are live on " + port);
});


MongoClient.connect(dblink, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err) {
        throw err;
    }
    var db = client.db(dbName);

    function responseData(file, data, res) {
        data['BaseUrl'] = BaseUrl;
        data['active'] = typeof sess.active != 'undefined' ? sess.active : 'dashboard';
        res.render(file, data);
    }

    app.get('/', (req, res) => {
        sess = req.session;
        responseData('adminPanel/index.html', {
            msg: '',
            msgs: '',
            error: true
        }, res);
      })


    // app.get('/', (req, res) => {
    //     sess = req.session;
    //     sess.active = 'dashboard';
    //     if (typeof sess.user != 'undefined') {
    //         console.log('here');
    //         res.redirect('/dashboard');
    //     } else {
    //         responseData('adminPanel/index.html', {
    //             error: false
    //         }, res);
    //     }
    //     console.log('done');
    // });


    app.post('/', (req, res) => {
        sess = req.session;
        sess.active = 'dashboard';
        if (typeof req.body.user == 'undefined' || typeof req.body.password == 'undefined') {
            return res.send({
                error: true,
                msg: 'parameter invalid'
            });
        }

        console.log("body ::::::: ", req.body);

        db.collection('admin').find({
            user: req.body.user,
            password: req.body.password
        }).toArray((err, results) => {
            if (results.length) {
                sess.user = req.body.user;
                res.redirect('/dashboard');
            } else {
                responseData('login.html', {
                    msg: 'Login Invalid',
                    error: true
                }, res);
            }
        })
    });

    app.get('/dashboard', (req, res) => {
        sess = req.session;
        console.log('  :: ' + sess)
        sess.active = 'dashboard';
        if (typeof sess.user != 'undefined') {
           
            db.collection('LudoNewUser').find({ isCPU: false }).count({}, (err, TU) => {
                db.collection('LudoNewUser').find({ createdAt: { "$gte": dt }, isCPU: false }).count((err, TTU) => {
                    db.collection('LudoNewUser').find({ createdAt: timed, isCPU: false }).count((error, TTYU) => {
                        db.collection('rooms').count({}, (errs, TR) => {
                            db.collection('ActiveUser').findOne({ id: '0' }, (er, resu) => {
                                datas.TotalUser = typeof TU != undefined ? TU : 0;
                                console.log(TU);
                                datas.TotalRoom = typeof TR != undefined ? TR : 0;
                                datas.TotalTopUser = typeof TU != undefined ? TU : 0;
                                datas.TotalAddUserToday = typeof TTU != undefined ? TTU : 0;
                                datas.TotalAddUserPrevday = typeof TTYU != undefined ? TTYU : 0;

                                if (datas.TotalTopUser > 10) {
                                    datas.TotalTopUser = 10;
                                }

                                if (er) {
                                    console.log(er)
                                }
                                if (res) {
                                    datas.TotalActiveUser = typeof resu.user != undefined ? resu.user : 0;
                                }
                                console.log(datas)
                                var data = {
                                    error: false,
                                    total: datas
                                };
                                responseData('dashboard.html', data, res);
                            });
                        });
                    });
                });
                //              });
                //          });
            });
        } else {
            res.redirect('/');
        }
    })


    app.get('/logout', (req, res) => {
        req.session.destroy(function (err) {
            res.redirect('/');
        })
    })

});
