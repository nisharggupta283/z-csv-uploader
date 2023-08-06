//App required imports
const express = require("express");
const bodyParser = require("body-parser");

//My imports
const csvRouter = require("./z-router/csvR");
//Start of Express
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'z-views');
app.use(express.static('z-static')); //in order to use static css and js files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use("/csv", csvRouter);

//Project start link ---------> http://localhost:8080/csv/see


//Start of server
app.listen(8000, function (err) {
  if (err) {
    console.log(
      "Error Occured----------------------------------------------------------------"
    );
    console.log(err);
    console.log(
      "Error Ocuured End-----------------------------------------------------------------"
    );
    return;
  }
  console.log("Server running at port 8000");
});
