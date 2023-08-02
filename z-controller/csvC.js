// const dbConnection = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");
const path = require('path');

const { CSV } = require("../z-models/scvM");
const db = require("../z-config/mongoose-config.js");

//function to get details of all the CSV Details
module.exports.getAllCSV = function (req, res) {
  CSV.find({})
    .then((result) => {
      console.log(result);
      res.render('index', { data: result });
    })
    .catch((err) => {
      res.render('index', { error: err });
    });
};

//function to store CSV file details into DB
module.exports.storeCSVDetails = function (res, original_name, filename, filepath, when) {
  CSV.create({
    original_name: original_name,
    stored_name: filename,
    filepath: filepath,
    when: when
  }).then((result) => {
    console.log('data saved sucessfully');
    console.table(result);
    res.redirect('/csv/see');
  }).catch((err) => {
    res.redirect('/csv/see', { error: err });
  })
}

//function to add the CSV Details into database TODO
module.exports.parseCSVandGetData = async function (req, res) {
  const data = new Array();
  console.log(req.query);
  CSV.findById(req.query.id)
    .then((result) => {
      let page_no = req.query.pageNo;
      if (page_no) //if request for first time then show them from 1 page case checked here 
        page_no = page_no * 100;
      else
        page_no = 1;
      console.log(`User request fro page_no ${page_no} ----------------->`);
      fs.createReadStream(path.join(__dirname, '../z-uploads/', result.stored_name))
        .pipe(parse({ delimiter: ",", from_line: page_no, to_line: page_no + 100 }))
        .on("data", function (row) {
          data.push(row);
        })
        .on("end", function () {
          console.log("finished parsing data and starting fill in DB");
          // console.log(data);
          if (req.query.flag == 1)
            res.json(data);
          else
            res.render('show-csv-list', { data: data, id: req.query.id });
        })
        .on("error", function (error) {
          console.log(error);
          res.json(error.message);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};


//function to add the CSV Details into database TODO
module.exports.filterData = async function (req, res) {
  const data = new Set();
  console.log(req.query);


  const key = req.query.select; //index of key
  const value = req.query.input; //matching regex value

  CSV.findById(req.query.id)
    .then((result) => {
      let page_no = req.query.pageNo;

      if (page_no && page_no != 1) //if request for first time then show them from 1 page case checked here 
        page_no = page_no * 100;

      console.log(`User request fro page_no ${page_no} -----------------> with filter key---${key} value---->${value}`);
      fs.createReadStream(path.join(__dirname, '../z-uploads/', result.stored_name))
        .pipe(parse({ delimiter: ",", from_line: page_no, to_line: page_no + 100 }))
        .on("data", function (row) {
          if (row[key].toLowerCase().indexOf(value.toLowerCase()) > -1)
            if (req.query.typedef == 1)
              data.add(row[key]);
            else
              data.add(row);
        })
        .on("end", function () {
          console.log(data.values);
          res.send([...data]);
        })
        .on("error", function (error) {
          console.log(error);
          res.json(error.message);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};