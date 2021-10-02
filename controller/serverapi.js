

exports.createOTP = (req, res) => {
    var data = req.body
    var otp = uniqid('0', 6);
    otpJson[data.Mobile_no] = otp

    var link;
    link = "http://198.15.103.106/API/pushsms.aspx?loginID=ssvltech1&password=SUMIT@12&mobile=" + data.Mobile_no + "&text=Welcome to Global Money, Your OTP is " + otp + " to verify your account on Global Money.&senderid=SSVLTE&route_id=1&Unicode=0";
    _req({
        "url": link,
        "json": true,
        "method": "get"
    }, (err, httpResponse, body) => {

        res.send({ error: false, msg: `opt send successfully to this Mobile Number ${data.Mobile_no}` })

    })
}

exports.verifyOTP = (req, res) => {
    var data = req.body
    if (otpJson[data.Mobile_no] == data.otp) {
        res.send({ error: false });
        delete otpJson[data.Mobile_no]
    }
    else {
        res.send({ error: true });
    }
}

exports.login = (req, res) => {
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
}

exports.Forgot = (req, res) => {
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
}

exports.register = (req, res) => {
    var data = req.body;

    if (data.sender_referid != '') {
        if (data.name == '' || data.Mobile_no == '' || data.password == '' || data.city == '') {
          return res.send({ error: true, data: {} })
        }
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

}

exports.User_Dashboard = (req, res) => {
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
}

exports.Pin_buy = (req, res) => {

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
                                        makeReceiver: 0,
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
}

exports.confirm_amount = (req, res) => {

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
}

exports.User_wallet_transfer = (req, res) => {

    var data = req.body;
    if (!objectId.isValid(data.User_id)) {
        return res.send({ error: true, data: {} })
    }

    db.collection('register').findOne({ _id: objectId(data.User_id) }, (err1, validuser) => {
        if (validuser.block == 1) {
            return res.send({ error: true, data: {} })
        }
        db.collection('register').findOne({ Mobile_no: data.Mobile_no }, (err2, receiver) => {


            if (validuser != undefined || validuser != null) {
                if (receiver != undefined || receiver != null) {
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
                            return res.send({ error: true, res: 2 })
                        }
                    } else {
                        return res.send({ error: true, res: 3 })
                    }
                } else {
                    return res.send({ error: true, res: 1 })
                }
            } else {
                return res.send({ error: true, data: {} })
            }

        })
    })

}

/* exports.User_history = (req, res) => {

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
    
 return res.send(req.body)
}*/



/*exports.add_balance = (req, res) => {
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
}*/

exports.add_balance = (req, res) => {
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
                        db.collection('register').findOne({ my_referid: myamount.sender_referid }, (err4, giveamount) => {
                            try {
                                var tenpersent = Math.round(mybal / 10)
                                if(0 >= tenpersent){
                                    throw new err
                                }
                                db.collection('register').findOneAndUpdate({ _id: objectId(giveamount._id) }, { $inc: { walletBalance: +tenpersent } }, (err5, updateamount) => {
                                    var bonusbal = {
                                        User_id: objectId(giveamount._id),
                                        fromBonusTr: insert.tr_id,
                                        fromBonusUName: myamount.name,
                                        amount: tenpersent,
                                        addby: 2,
                                        tr_id: uniqid('Aa0', 12),
                                        date: currentTime
                                    }
                                    db.collection('walletHistory').insertOne(bonusbal, (err6, insertbonus) => {
                                        try {
                                            var mydata = {
                                                User_id: myamount._id,
                                                walletBalance: myamount.walletBalance
                                            }
                                            return res.send({ error: false, data: mydata })
                                        } catch (error) {
                                            return res.send(error)
                                        }
                                    })
                                })
                            } catch (error) {
                                try {
                                    var mydata = {
                                        User_id: myamount._id,
                                        walletBalance: myamount.walletBalance
                                    }
                                    return res.send({ error: false, data: mydata })
                                } catch (error) {
                                    return res.send(error)
                                }
                            }
                        })
                    })
                })
            })
        } else {
            return res.send({ error: true, data: {} })
        }
    })
}

exports.Wallet = (req, res) => {
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
}

exports.user_profile = (req, res) => {
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
}

exports.todayPin = (req, res) => {
    db.collection('todaypin').findOne({ visible: 0 }, (err1, validuser) => {
        if (validuser == null) {
            db.collection('register').findOne({ _id: objectId(req.body.User_id) }, (err2, userwallet) => {

                if (userwallet) {
                    db.collection('todaypin').findOne({ visible: 2 }, (err3, mypinn) => {
                        if (mypinn == null) {
                            mypinn = {}
                            return res.send({ error: true, Uwallet: userwallet.walletBalance, mymili: 0, data: mypinn })
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
}

exports.sharedata = (req, res) => {
    db.collection('sharedata').find({}).sort({ _id: -1 }).limit(1).toArray((err, result) => {
        //   res.send(result[0])
        if (result[0] != undefined) {
            res.send({ error: false, data: result[0] })
        } else {
            res.send({ error: true, data: {} })
        }
    })
}

exports.ph_history = (req, res) => {

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
                use: '$use',
                Tr_id: '$Tr_id',
                status: '$status',
                date: '$date'
            }
        },
        
        { $match: { use: 1 } }
    ]
    
    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {
        
        if (myph != undefined || myph != null) {
            return res.send({ error: false, data: myph })
        } else {
            return res.send({ error: true, data: {} })
        }
    })

}

exports.rh_history = (req, res) => {

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
        },

        { $match: { use: 1 } }
    ]

    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

        if (myph != undefined || myph != null) {
            return res.send({ error: false, data: myph })
        } else {
            return res.send({ error: true, data: {} })
        }
    }) 

}

exports.user_wallet_history = (req, res) => {

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

}

exports.myTeam = (req, res) => {

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

}

exports.myteamcount = (req, res) => {

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

}

exports.ph_link = (req, res) => {
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
                use: '$use',
                Tr_id: '$Tr_id',
                status: '$status',
                date: '$date'
            }
        },

        { $match: { use: 0 } }
    ]

    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

        if (myph != undefined || myph != null) {
            return res.send({ error: false, data: myph })
        } else {
            return res.send({ error: true, data: {} })
        }
    })
}

exports.rh_link = (req, res) => {
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
        },
   
        { $match: { use: 0 } }
    ]

    db.collection('phrh').aggregate(aggregate).sort({ _id: -1 }).toArray((err1, myph) => {

        if (myph != undefined || myph != null) {
            return res.send({ error: false, data: myph })
        } else {
            return res.send({ error: true, data: {} })
        }
    })
}

exports.sendAmountHistory = (req, res) => {
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
    { $unwind: '$sender' },
    {
        $project: {
            _id: 1,
            sender_id: 1,
            receiver_id: 1,
            receiver_name: '$sender.name',
            date: 1,
            Tr_id: 1,
            amount: 1,
            Mobile_no: '$sender.Mobile_no'
        }
    },
    { $match: { sender_id: objectId(req.body.User_id) } },
    { $sort: {date: -1}}
    ]
    db.collection('walletTransfer').aggregate(aggregate).toArray((err1, mysendmoney) => {
        res.send({ error: false, data: mysendmoney })
    })
}

exports.receiveAmountHistory = (req, res) => {
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
    { $unwind: '$receiver' },
    {
        $project: {
            _id: 1,
            sender_id: 1,
            receiver_id: 1,
            receiver_name: '$receiver.name',
            date: 1,
            Tr_id: 1,
            amount: 1,
            Mobile_no: '$receiver.Mobile_no'
        }
    },
    { $match: { receiver_id: objectId(req.body.User_id) } },
    { $sort: {date: -1}}
    ]
    db.collection('walletTransfer').aggregate(aggregate).toArray((err1, mysendmoney) => {
        res.send({ error: false, data: mysendmoney })
    })
}

exports.ifexist = (req, res) => {
    db.collection('register').findOne({Mobile_no: req.body.Mobile_no}, (err, exist) => {
        try {
            if (!exist) { 
                throw new err 
            }
            if(exist.block == 1) { 
                return res.send({error: false, data: 1, msg: 'User Blocked'}) 
            }
            return res.send({error: false})
        } catch (error) {
            return res.send({error: true})
        }
    })
}
