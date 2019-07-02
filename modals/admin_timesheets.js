const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
var Request = require("tedious").Request;

app.use(bodyParser.json());

// Create connection to database

var config = {
  authentication: {
    options: {
      userName: "yash", // update me
      password: "Myageis@20" // update me
    },
    type: "default"
  },
  server: "yashtesting.database.windows.net", // update me
  options: {
    database: "timesheets",
    encrypt: true
  }
};


 router.get("/approve_timesheets", (req, res, next) => {
   var new_data = {};
   var dataget = [];

   var connection = new Connection(config);

   connection.on("connect", function(err) {
     if (err) {
       console.log(err);
     } else {
       queryDatabase();
       console.log("database connected");
     }
   });
   function queryDatabase() { 
     var query1 =
       "SELECT * FROM TIMESHEETS ";

     var request = new Request(query1, function(
       err,
       recordset,
       rowCount,
       rows
     ) {
       res.send(dataget);
     });

     request.on("row", function(columns) {
       columns.forEach(function(column) {
         var column_name = column.metadata.colName;
         var column_data = column.value;

         new_data[column_name] = column_data;
       });

       dataget.push(new_data);
       new_data = {};
     });

     connection.execSql(request);
   }
 });


router.get("/view_timesheets", (req, res, next) => {
  var new_data = {};
  var dataget = [];

  var connection = new Connection(config);

  connection.on("connect", function(err) {
    if (err) {
      console.log(err);
    } else {
      queryDatabase();
      console.log("database connected");
    }
  });
  function queryDatabase() {
    var query1 = "SELECT * FROM TIMESHEETS";

    var request = new Request(query1, function(err, recordset, rowCount, rows) {
      res.send(dataget);
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        var column_name = column.metadata.colName;
        var column_data = column.value;

        new_data[column_name] = column_data;
      });

      dataget.push(new_data);
      new_data = {};
    });

    connection.execSql(request);
  }
});





module.exports = router; //the router with routes is exported and can be used in other files

