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
  server: jsonContent.server, // update me
  options: {
    database: jsonContent.database,
    encrypt: true
  }
};

router.post("/admin_info", (req, res, next) => {
  console.log(req.body.data);
  var connection = new Connection(config);
  var new_data = [];

  connection.on("connect", function(err) {
    if (err) {
      console.log(err);
    } else {
      queryDatabase();
      console.log("database connected");
    }
  });
  function queryDatabase() {
    var emp_id = req.body.data;

    var query1 = "SELECT * FROM EMPLOYEES WHERE  emp_id='" + emp_id + "';";

    var request = new Request(query1, function(err, rowCount, rows) {
      console.log(rowCount);

      if (rowCount == 0) {
        query =
          "INSERT INTO EMPLOYEES VALUES('" + emp_id + "','','','','','','');";

        var request = new Request(query, function(err, rowCount, rows) {
          console.log("user inserted");
        });

        request.on("row", function(columns) {
          columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
          });
        });
        connection.execSql(request);
      } else {
        res.send(new_data);
        console.log("else is called");
      }
    });
    request.on("row", function(columns) {
      columns.forEach(function(column) {
        var column_name = column.metadata.colName;
        var column_data = column.value;

        new_data.push({
          column_name: column_name,
          column_data: column_data
        });
      });
    });

    connection.execSql(request);
  }
});


module.exports = router; //the router with routes is exported and can be used in other files
