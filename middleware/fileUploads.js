const multer = require('multer');
const fs = require('fs');
const folderMain = "uploads";
const folderName1 = "uploads/documents/";
const folderName2 = "uploads/profileImage/";

if (!fs.existsSync(folderMain)) {
    fs.mkdirSync(folderMain);
}

if (!fs.existsSync(folderName1)) {
    fs.mkdirSync(folderName1);
}

if (!fs.existsSync(folderName2)) {
    fs.mkdirSync(folderName2);
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, res, cb) {
            cb(null, folderName1);
        },
        filename: function (req, file, cb) {
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, file.fieldname + "-" + Date.now() + '.' + extension);
        }
    })
});

var documentUpload = upload.fields([
    { name: 'licenseImage'},
    { name: 'aadharImage'},
    { name: 'panImage'}
]);


const profileImage = multer({
    storage:multer.diskStorage({
       destination : function(req,res,cb){
           cb(null, folderName2)
       },
       filename:function(req,file,cb){
           let extArray = file.mimetype.split("/");
           let extension = extArray[extArray.length - 1];
           cb(null,file.fieldname+"-"+Date.now()+ '.' +extension);
       }

    })

   
   }).single("profile_image");

module.exports = { documentUpload, profileImage };