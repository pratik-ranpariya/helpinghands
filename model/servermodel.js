

var controller = module.exports = require('../controller/serverapi.js');

module.exports = {

    myapi: () => {

        //post api
        app.post('/' + verson + '/login',  controller.login)
        app.post('/' + verson + '/Forgot',  controller.Forgot)
        app.post('/' + verson + '/register',  controller.register)
        app.post('/' + verson + '/User_Dashboard',  controller.User_Dashboard)
        app.post('/' + verson + '/Pin_buy',  controller.Pin_buy)
        app.post('/' + verson + '/confirm_amount',  controller.confirm_amount)
        app.post('/' + verson + '/User_wallet_transfer',  controller.User_wallet_transfer)
//        app.post('/' + verson + '/User_history',upload.any(),  controller.User_history)
        app.post('/' + verson + '/add_balance',  controller.add_balance)
        app.post('/' + verson + '/user_profile',  controller.user_profile)
        app.post('/' + verson + '/ph_history',  controller.ph_history)
        app.post('/' + verson + '/rh_history',  controller.rh_history)
        app.post('/' + verson + '/user_wallet_history',  controller.user_wallet_history)
        app.post('/' + verson + '/myTeam',  controller.myTeam)
        app.post('/' + verson + '/myteamcount',  controller.myteamcount)
        app.post('/' + verson + '/ph_link',  controller.ph_link)
        app.post('/' + verson + '/rh_link',  controller.rh_link)
        app.post('/' + verson + '/sendAmountHistory',  controller.sendAmountHistory)
        app.post('/' + verson + '/receiveAmountHistory',  controller.receiveAmountHistory)
        app.post('/' + verson + '/createOTP',  controller.createOTP)
        app.post('/' + verson + '/verifyOTP',  controller.verifyOTP)
        app.post('/' + verson + '/Wallet',  controller.Wallet)
        app.post('/' + verson + '/todayPin',  controller.todayPin)
        app.post('/' + verson + '/ifexist', controller.ifexist)
        
        //get Api
        app.get('/' + verson + '/sharedata',  controller.sharedata)

    }
}
