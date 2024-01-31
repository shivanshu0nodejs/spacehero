const jwt =  require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const User = require('../models/userModel.js');
const logs = require("./logger.js");

const sph = "SPH";

const login = async(req, res) => {

    try{

        const {phone} = req.body;

        if(phone != null && phone != undefined){

            const userFound = await User.findOne({$and:[{phone: phone}, {role: 3}]});

            if(userFound != null){

                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }

                const axios = require('axios');
                const FormData = require('form-data');
                let data = new FormData();

                data.append('apikey', 'NmU3ODU1Mzk3YTZhNzE2NjQzNGI3NDM0NDQzMTRiNGM=');
                data.append('numbers', phone);
                data.append('sender', 'LVFITT');

                if(userFound.name){

                    data.append('message', `Dear ${userFound.name}, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                }else{

                    data.append('message', `Dear User, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                }

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.textlocal.in/send/',
                headers: { 
                    'Cookie': 'PHPSESSID=t9ptng990ncra53oilasq0mf56', 
                    ...data.getHeaders()
                },
                data : data
                };

                axios.request(config)
                .then((response) => {

                })
                .catch((error) => {
                console.log(error);
                });
    
                res.send({
                    Status: true,
                    Message: "OTP Sent",
                    Data: {

                        Otp: OTP
                    }
                })

                await User.updateOne({phone: phone}, {$set: {otp: OTP}});

                logs.newLog.log('info', "OTP Sent");

            }else if(userFound == null){

                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }

                const axios = require('axios');
                const FormData = require('form-data');
                let data = new FormData();

                data.append('apikey', 'NmU3ODU1Mzk3YTZhNzE2NjQzNGI3NDM0NDQzMTRiNGM=');
                data.append('numbers', phone);
                data.append('sender', 'LVFITT');
                data.append('message', `Dear User, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.textlocal.in/send/',
                headers: { 
                    'Cookie': 'PHPSESSID=t9ptng990ncra53oilasq0mf56', 
                    ...data.getHeaders()
                },
                data : data
                };

                axios.request(config)
                .then((response) => {

                })
                .catch((error) => {
                console.log(error);
                });

                const total = await User.countDocuments({});
    
                if(total>0){
                    
                    const last = await User.find().sort({_id:-1}).limit(1);
                    var numb = last[0].doc_num;

                }else{
                    var numb = 0;
                }
        
                if(total<10 ){
                    var userId = sph.concat("00000",numb + 1);
                }else if(total<100){
                    var userId = sph.concat("0000",numb + 1);
                }else if(total<1000){
                    var userId = sph.concat("000",numb + 1);
                }else if(total<10000){
                    var userId = sph.concat("00",numb + 1);
                }else if(total<100000){
                    var userId = sph.concat("0",numb + 1);
                }

                const totalNum = numb+1;

                const Data = new User ({

                    userId: userId,
                    doc_num: totalNum,
                    phone: phone,
                    otp: OTP,
                    status:0,
                    role:3,
                    tokens:'xxxx'
                    
                })

                await Data.save();

                res.send({
                    Status: true,
                    Message: "OTP Sent",
                    Data: {

                        Otp: OTP
                    }
                })

                logs.newLog.log('info', "OTP Sent");

            }

        }else{
    
            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}

const loginOtp = async(req, res) => {

    try{

        const {phone, otp} = req.body;

        if(phone != null && phone != undefined, otp != null && otp != undefined){

            const userFound = await User.findOne({$and:[{phone: phone}, {role: 3}]});

            if(userFound != null){

                if(userFound.otp == otp){

                    var isProfile = 0;

                    if(userFound.name != null && userFound.name != undefined){

                        isProfile = 1;

                    }

                    var isVehicle = 0;

                    const Car = require('../models/myCarModel.js');

                    var carFind = await Car.findOne({userId: userFound.userId});

                    if(carFind != null){

                        isVehicle = 1;

                    }

                    var isName = "User";

                    if(userFound.name){

                        isName = userFound.name;

                    }

                    
                    jwt.verify(userFound.tokens, secretKey,(err, authData)=>{

                        if(err){
        
                            jwt.sign({userFound}, secretKey, {expiresIn:'365d'}, async (err, token) => {

                                var newData = {

                                    tokens: token,
                                    status: 1
                                }
        
                                await User.updateOne({ phone: phone }, {$set: newData});
                
                            })
        
                        }})

                        res.send({
                            Status: true,
                            Message: "Login successfull",
                            Data:{
                                userId: userFound.userId,
                                phone: phone,
                                name: isName,
                                isProfile: isProfile,
                                isVehicle: isVehicle
                            }
                        })
        
                    logs.newLog.log('info', "Login successfull");

                }else{

                    res.send({
                        Status: false,
                        Message: "Invalid otp"
                    })
        
                    logs.newLog.log('info', "Invalid otp");

                }
            }

        }else{

            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}


const addProfile = async(req, res) => {

    try{

        const {userId, name, email, gender, referral} = req.body;

        if(userId != null && userId != undefined, name != null && name != undefined){

            var newData = {

                name: name,
                gender: gender,
                email: email,
                referral: referral
            }

            var updateStatus = await User.updateOne({ userId: userId }, {$set: newData});

            if(updateStatus.modifiedCount == 1){
                                            
                res.send({
                    Status: true,
                    Message: "Profile updated",
                    Data:{
                        userId: userId,
                        name: name,
                        gender: gender,
                        email: email,
                        referral: referral
                    }
                })
    
                logs.newLog.log('info', "Profile updated");

            }else{
                        
                res.send({
                    Status: false,
                    Message: "Failed to update profile"
                    
                })

                logs.newLog.log('info', "Failed to update profile");

            }

        }else{

            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}


const addProfileImage = async(req, res) => {

    try{

        const {userId} = req.body;

        if(userId != null && userId != undefined, req.file != undefined){

            const imgUrl = req.file.destination + req.file.filename;

            var newData = {

                userImage: imgUrl,
                imageStatus: 0
                
            }

            var updateStatus = await User.updateOne({ userId: userId }, {$set: newData});

            if(updateStatus.modifiedCount == 1){
                                            
                res.send({
                    Status: true,
                    Message: "Profile updated"

                })
    
                logs.newLog.log('info', "Profile updated");

            }else{
                        
                res.send({
                    Status: false,
                    Message: "Failed to update profile"
                    
                })

                logs.newLog.log('info', "Failed to update profile");

            }

        }else{

            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}


const loginValetOtp = async(req, res) => {

    try{

        const {phone} = req.body;

        if(phone != null && phone != undefined){

            const userFound = await User.findOne({$and:[{phone: phone}, {role: 2}]});

            if(userFound != null){

                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }

                const axios = require('axios');
                const FormData = require('form-data');
                let data = new FormData();

                data.append('apikey', 'NmU3ODU1Mzk3YTZhNzE2NjQzNGI3NDM0NDQzMTRiNGM=');
                data.append('numbers', phone);
                data.append('sender', 'LVFITT');

                if(userFound.name){

                    data.append('message', `Dear ${userFound.name}, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                }else{

                    data.append('message', `Dear User, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                }

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.textlocal.in/send/',
                headers: { 
                    'Cookie': 'PHPSESSID=t9ptng990ncra53oilasq0mf56', 
                    ...data.getHeaders()
                },
                data : data
                };

                axios.request(config)
                .then((response) => {

                })
                .catch((error) => {
                console.log(error);
                });
    
                res.send({
                    Status: true,
                    Message: "OTP Sent",
                    Data: {

                        Otp: OTP
                    }
                })

                await User.updateOne({phone: phone}, {$set: {otp: OTP}});

                logs.newLog.log('info', "OTP Sent");

            }else if(userFound == null){

                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }

                const axios = require('axios');
                const FormData = require('form-data');
                let data = new FormData();

                data.append('apikey', 'NmU3ODU1Mzk3YTZhNzE2NjQzNGI3NDM0NDQzMTRiNGM=');
                data.append('numbers', phone);
                data.append('sender', 'LVFITT');
                data.append('message', `Dear User, ${OTP} is your LivFitt login OTP, do not share it with anyone. LivFitt`);

                let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.textlocal.in/send/',
                headers: { 
                    'Cookie': 'PHPSESSID=t9ptng990ncra53oilasq0mf56', 
                    ...data.getHeaders()
                },
                data : data
                };

                axios.request(config)
                .then((response) => {

                })
                .catch((error) => {
                console.log(error);
                });

                const total = await User.countDocuments({});
    
                if(total>0){
                    
                    const last = await User.find().sort({_id:-1}).limit(1);
                    var numb = last[0].doc_num;

                }else{
                    var numb = 0;
                }
        
                if(total<10 ){
                    var userId = sph.concat("00000",numb + 1);
                }else if(total<100){
                    var userId = sph.concat("0000",numb + 1);
                }else if(total<1000){
                    var userId = sph.concat("000",numb + 1);
                }else if(total<10000){
                    var userId = sph.concat("00",numb + 1);
                }else if(total<100000){
                    var userId = sph.concat("0",numb + 1);
                }

                const totalNum = numb+1;

                const Data = new User ({

                    userId: userId,
                    doc_num: totalNum,
                    phone: phone,
                    otp: OTP,
                    status:0,
                    role:2,
                    active: 0,
                    tokens:'xxxx'
                    
                })

                await Data.save();

                res.send({
                    Status: true,
                    Message: "OTP Sent",
                    Data: {

                        Otp: OTP
                    }
                })

                logs.newLog.log('info', "OTP Sent");

            }

        }else{
    
            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}


const loginValet = async(req, res) => {

    try{

        const {phone, otp} = req.body;

        if(phone != null && phone != undefined, otp != null && otp != undefined){

            const userFound = await User.findOne({$and:[{phone: phone}, {role: 2}]});

            if(userFound != null){

                if(userFound.otp == otp){

                    var isProfile = 0;

                    var isName = "User"

                    if(userFound.name != null && userFound.name != undefined){

                        isProfile = 1;

                        isName = userFound.name;

                    }

                    var isDocument = 0;

                    const Document = require('../models/documentModel.js');

                    var docsFind = await Document.findOne({userId: userFound.userId});

                    if(docsFind != null){

                        isDocument = 1;

                    }

                    var isPhoto = 0;

                    if(userFound.userImage){

                        isPhoto = 1;

                    }

                    jwt.verify(userFound.tokens, secretKey,(err, authData)=>{

                        if(err){
        
                            jwt.sign({userFound}, secretKey, {expiresIn:'365d'}, async (err, token) => {

                                var newData = {

                                    tokens: token,
                                    status: 1
                                }
        
                                await User.updateOne({ phone: phone, role: 2 }, {$set: newData});
                
                            })
        
                        }})

                        res.send({
                            Status: true,
                            Message: "Valet login successfull",
                            Data:{
                                userId: userFound.userId,
                                phone: phone,
                                name: isName,
                                isProfile: isProfile,
                                isDocument: isDocument,
                                isPhoto: isPhoto
                            }
                        })
        
                    logs.newLog.log('info', "Valet login successfull");

                }else{

                    res.send({
                        Status: false,
                        Message: "Invalid otp"
                    })
        
                    logs.newLog.log('info', "Invalid otp");

                }
            }

        }else{

            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}


const addValetInfo = async(req, res) => {

    try{

        const {userId, name, email, gender, language, referral, joinAs} = req.body;

        if(userId != null && userId != undefined && name != null && name != undefined && language != null && language != undefined && joinAs != null && joinAs != undefined){

            var newData = {

                name: name,
                gender: gender,
                email: email,
                joinAs: joinAs,
                language: language,
                referral: referral

            }

            var updateStatus = await User.updateOne({ userId: userId, role: 2 }, {$set: newData});


            if(updateStatus.modifiedCount == 1){
                                            
                res.send({
                    Status: true,
                    Message: "Valet info updated",
                    Data:{
    
                        name: name,
                        gender: gender,
                        email: email,
                        joinAs: joinAs,
                        language: language,
                        referral: referral
    
                    }
                })
    
                logs.newLog.log('info', "Valet info updated");

            }else{
                        
                res.send({
                    Status: false,
                    Message: "Failed to update valet info"

                })

                logs.newLog.log('info', "Failed to update valet info");

            }

        }else{

            res.send({
                Status: false,
                Message: "Please enter required fields"
            })

            logs.newLog.log('info', "Please enter required fields");

        }

    }catch(e){

        console.log(e);

    }
}

module.exports = {login, loginOtp, addProfile, loginValetOtp, loginValet, addValetInfo, addProfileImage};
