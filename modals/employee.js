const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
// const config = require("./configurations/config");
const app = express();
var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
var fs = require("fs");
app.use(bodyParser.json());

// Create connection to database
var contents = fs.readFileSync("authentication.json");
var jsonContent = JSON.parse(contents);

var config = {
  authentication: {
    options: {
      userName: jsonContent.userName,
      password: jsonContent.password
    },
    type: "default"
  },
  server: jsonContent.server,
  options: {
    database: jsonContent.database,
    encrypt: true
  }
};

router.post("/employee", (req, res, next) => {
  var connection = new Connection(config);


  // Attempt to connect and execute queries if connection goes through
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
    var emp_id = data.data.emp_id;
    var name = data.data.name;
    var title = data.data.title;
    var team = data.data.team;
    var manager = data.data.manager;
    var manager_emp_id = data.data.manager_id;
    var asset_type = data.data.asset_type;

    var query1 =
      "UPDATE EMPLOYEES SET name='" +
      name +
      "',title='" +
      title +
      "', team='" +
      team +
      "',manager='" +
      manager +
      "',manager_emp_id='" +
      manager_emp_id +
      "',asset_type='" +
      asset_type +
      "' where emp_id='" +
      emp_id +
      "'"; 
    var request = new Request(query1, function(err, rowCount, rows) {
    
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
    connection.execSql(request);
  }
});

router.post("/emp", (req, res, next) => {
  console.log(req.body.data);


  
  var connection = new Connection(config);


  
      if (req.body.username === "aymen") {
        if (req.body.password === 123) {
          //if eveything is okey let's create our token

          const payload = {
            check: true
          };

          var token = jwt.sign(payload, app.get("Secret"), {
            expiresIn: 1440 // expires in 24 hours
          });

          res.json({
            message: "authentication done ",
            token: token
          });
        }
      }

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
           
        });

        request.on("row", function(columns) {
          columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
          });
        });
        connection.execSql(request);
      } else {
        res.send(new_data); 
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

module.exports = router;  
