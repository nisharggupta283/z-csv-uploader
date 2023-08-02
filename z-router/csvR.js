const express = require('express');
const path = require('path');
const multer = require('multer');
const csvController = require('../z-controller/csvC');
let filepath = '';
let filename='';
let flag = true;
//start Router
const router = express.Router();
//storage type defined
const storage = multer.diskStorage({
    destination: function (req, file, callBack) {
        console.log(__dirname);
        callBack(null, path.join(__dirname, '../z-uploads'));
    },
    filename: function (req, file, callBack) {
        filename=file.originalname;
        filepath = `${new Date().getTime()}${file.originalname}`;
        
        console.log(`------------------------------>file.mimetype : ${file.mimetype}`);
        if (file.mimetype == 'text/csv')
            flag = true;
        else
            flag = false;
        console.log(filepath);
        callBack(null, filepath);
    }
});
//give storage type configuration to multer
const upload = multer({ storage: storage });


console.log('Router see-stdt.js is called and loaded See Student Detail Called');

router.post('/save-file', upload.array('data'), function (req, res) {
    if(flag)
    csvController.storeCSVDetails(res,filename, filepath,path.join(__dirname, "../z-uploads", filepath),new Date());
    else
    res.render('index.html',{error_message:"File type not supported"});
});

router.get('/see', csvController.getAllCSV);

router.get('/csvdata',csvController.parseCSVandGetData);

router.all('/filter',csvController.filterData);
module.exports = router;
