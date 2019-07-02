const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express();
var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
 var fs = require("fs");


app.use(bodyParser.json());
//reading the authentication file to get the username and password
 var contents = fs.readFileSync("authentication.json");
 var jsonContent = JSON.parse(contents);
  
// Create connection to database

var config = {
  authentication: {
    options: {
      userName: jsonContent.userName, // update me
      password: jsonContent.password // update me
    },
    type: "default"
  },
  server: "yashtesting.database.windows.net", // update me
  options: {
    database: "timesheets",
    encrypt: true
  }
};  
router.post("/project", (req, res, next) => {
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
    var data = req.body;
    console.log(data);
    var PROJECTID = data.PROJECTID;
    var PROJECTNAME = data.PROJECTNAME;
    var MANAGER_EMP_ID = data.MANAGER_EMP_ID;
    var STARTDATE = data.STARTDATE;
    var ENDDATE = data.ENDDATE;
    var BILLED_ASSETS = data.BILLED_ASSETS;
    var BUDGET = data.BUDGET;
     
     var query =
       "INSERT INTO PROJECTS VALUES('" +
       PROJECTNAME +
       "','" +
       MANAGER_EMP_ID +
       "','" +
       STARTDATE +
       "','" +
       ENDDATE +
       "'," +
       BILLED_ASSETS +
       ",'" +
       BUDGET +
       ",'" +
       "Some Parner" +
       ",'" +
       "xyz@celebaltech.com"+
       "');";
 console.log(query)
    var request = new Request( query, function(err, rowCount, rows) {
      console.log("project is called");
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
    connection.execSql(request);
  }
});



router.get("/project", (req, res, next) => {
  var connection = new Connection(config);
   var new_data = {};
   var dataget = [];
 
  connection.on("connect", function(err) {
    if (err) {
      console.log(err);
    } else {
      queryDatabase();
      console.log("database connected");
    }
  });

  function queryDatabase() {
  
 var request = new Request( "select * from projects", function(err, rowCount, rows) {
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
