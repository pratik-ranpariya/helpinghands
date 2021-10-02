var controller = module.exports = require('../controller/webHandler.js');
var removetimer, removetimes;
module.exports = {

    callaftetTime: (startDate, endDate) => {

        var currentTimes = new Date()
        currentTimes.setUTCHours(currentTimes.getHours() + 5);
        currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
        var timeDiff = endDate - currentTimes;

        removetimer = setTimeout(() => {
            db.collection('todaypin').updateMany({ visible: 0 }, { $set: { visible: 1 } })
        }, timeDiff);
    },

    clearTimeouts: () => {
        clearTimeout(removetimer);
    },

    myTime: () => {
        clearTimeout(removetimes);
    },

    callbeforeTime: (startDate) => {
        var currentTimes = new Date()
        currentTimes.setUTCHours(currentTimes.getHours() + 5);
        currentTimes.setUTCMinutes(currentTimes.getMinutes() + 30);
        var timeDiff = startDate - currentTimes;
        removetimes = setTimeout(() => {

            db.collection('todaypin').updateMany({ visible: 2 }, { $set: { visible: 0 } })

        }, timeDiff);
    },


    responseData: (file, data, res) => {
        data['BaseUrl'] = BaseUrl;
        res.render(file, data);
    },

    pagination: (collectionName, pagePath, res, req, data) => {
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
                webModel.responseData(pagePath, data, res)

            })
        })

    },

    adminHandler: () => {


        //post api
        app.post('/insertpin', controller.insertpin)
        app.post('/insertph_link', controller.insertph_link)
        app.post('/insertrh_link', controller.insertrh_link)
        app.post('/login', controller.login)
        app.post('/phrh/:page', controller.post_phrh)
        app.post('/insertph_rh', controller.insertph_rh)
        app.post('/ph_rh/:page', controller.post_ph_rh)
        app.post('/ph_link/:page', controller.post_ph_link)
        app.post('/rh_link/:page', controller.post_rh_link)
        app.post('/userlist/:page', controller.post_userlist)
        app.post('/pbp/:page', controller.post_pbp)
        app.post('/sharedata', controller.post_sharedata)
        app.post('/amountaddhistory/:page', controller.post_amountaddhistory)
        app.post('/userwallet/:page', controller.post_userwallet)
        app.post('/getwalletAmount', controller.getwalletAmount)
        app.post('/addpinbyadmin', controller.addpinbyadmin)
        app.post('/updatewalletbyadmin', controller.updatewalletbyadmin)
        app.post('/givercl', controller.givercl)




        //get Api
        app.get('/', controller.loginpage)
        app.get('/addpinhistory/:page', controller.addpinhistory)
        app.get('/purchasePinHistory/:page', controller.purchasePinHistory)
        app.get('/get_rl/:_id', controller.get_rl)
        app.get('/block/:_id', controller.block)
        app.get('/userdata/:_id', controller.userdata)
        app.get('/logout', controller.logout)
        app.get('/resetpin', controller.resetpin)
        app.get('/dashboard', controller.dashboard)
        app.get('/rcl', controller.rcl)
        app.get('/addpin', controller.addpin)
        app.get('/ph_link/:page', controller.get_ph_link)
        app.get('/phrh/:page', controller.get_phrh)
        app.get('/giveph_rh/:_id', controller.giveph_rh)
        app.get('/getphrh/:value/:_id', controller.getphrh)
        app.get('/ph_rh/:page', controller.get_ph_rh)
        app.get('/pbp/:page', controller.get_pbp)
        app.get('/shareData', controller.get_shareData)
        app.get('/rh_link/:page', controller.get_rh_link)
        app.get('/amountaddhistory/:page', controller.get_amountaddhistory)
        app.get('/userwallet/:page', controller.get_userwallet)
        app.get('/get_pl/:_id', controller.get_pl)
        app.get('/userlist/:page', controller.get_userlist)
        app.get('/moneyTrHistory/:page', controller.moneyTrHistory)
        app.get('/blocklist/:page', controller.blocklist)
        app.get('/History', controller.History)
        app.get('/phhistory/:page', controller.phhistory)
        app.get('/rhhistory/:page', controller.rhhistory)
        app.get('/cAmountHistory/:page', controller.cAmountHistory)

    }
}