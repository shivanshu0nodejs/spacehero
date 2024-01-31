const Document = require('../models/documentModel.js');
const logs = require("./logger.js");
const BASE_URL = process.env.SITE_URL;


const addDocument = async(req, res) => {

    try{

        const {userId} = req.body;

        if(userId != "" && userId != undefined && req.files != undefined){

            var findDoc = await Document.findOne({userId: userId});

            if(findDoc == null){
    
                const licenseUrl = req.files.licenseImage[0].destination + req.files.licenseImage[0].filename;
                const aadharUrl = req.files.aadharImage[0].destination + req.files.aadharImage[0].filename;
                const panUrl = req.files.panImage[0].destination + req.files.panImage[0].filename;
    
                const Data = new Document ({
    
                    userId: userId,
                    drivingLicense: licenseUrl,
                    licenseStatus: 0,
                    aadharCard: aadharUrl,
                    aadharStatus: 0,
                    panCard: panUrl,
                    panStatus: 0,
                    statusMessage: "Pending",
                    status: 0
    
                })
    
                await Data.save();
    
                res.send({
                    Status: true,
                    Message: "Document added successfully",
                    Data
                })
    
                logs.newLog.log('info', "Document added successfully");
    
            }else{
    
                res.send({
                    Status: true,
                    Message: "Document already uploaded"
                })
    
                logs.newLog.log('info', "Document already uploaded");
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


const documentDetail = async(req, res) => {

    try{

        const {userId} = req.body;

        if(userId != "" && userId != undefined){

            var findDoc = await Document.findOne({userId: userId});

            if(findDoc != null){

                const Data = ({

                    userId: findDoc.userId,
                    drivingLicense: BASE_URL + findDoc.drivingLicense,
                    licenseStatus: findDoc.licenseStatus,
                    aadharCard: BASE_URL + findDoc.aadharCard,
                    aadharStatus: findDoc.aadharStatus,
                    panCard: BASE_URL + findDoc.panCard,
                    panStatus: findDoc.panStatus,
                    statusMessage: findDoc.statusMessage,
                    status: findDoc.status
    
                })
    
                res.send({
                    Status: true,
                    Message: "Document detail",
                    Data
                })
    
                logs.newLog.log('info', "Document detail");

            }else{

                res.send({
                    Status: true,
                    Message: "No document found"
                })
    
                logs.newLog.log('info', "No document found");

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


const UpdateDocument = async(req, res) => {

    try{

        const {userId, license, aadhar, pan} = req.body;

        if(userId != "" && userId != undefined && license != undefined && aadhar != undefined && pan != undefined && req.files != undefined){

            var licenseUrl = license;

            if(licenseUrl == ""){

                licenseUrl = req.files.licenseImage[0].destination + req.files.licenseImage[0].filename;
            }

            var aadharUrl = aadhar;

            if(aadharUrl == ""){

                aadharUrl = req.files.aadharImage[0].destination + req.files.aadharImage[0].filename;
            }

            var panUrl = pan;

            if(panUrl == ""){

                panUrl = req.files.panImage[0].destination + req.files.panImage[0].filename;

            }


            const Data = {

                userId: userId,
                drivingLicense: licenseUrl,
                aadharCard: aadharUrl,
                panCard: panUrl,
                statusMessage: "Pending",
                status: 0

            }

            const updateStatus = await Document.updateOne({ userId: userId }, {$set: Data });
                
            if(updateStatus.modifiedCount == 1){
                        
                res.send({
                    Status: true,
                    Message: "Document updated successfully",
                    Data
                })

                logs.newLog.log('info', "Document updated successfully");

            }else{
                        
                res.send({
                    Status: false,
                    Message: "Failed to update document"
                })

                logs.newLog.log('info', "Failed to update document");

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

module.exports = {addDocument, documentDetail, UpdateDocument}