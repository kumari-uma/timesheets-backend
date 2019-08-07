const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const app = express(); 
var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
var Request = require("tedious").Request;
var fs = require("fs");
const jwt = require("jsonwebtoken");
app.use(bodyParser.json());

const config1 = require("../configurations/config");


app.set("Secret", config1.secret);
 
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


 
        const payload = {
          check: true
        };

        var token = jwt.sign(payload, app.get("Secret"), {
          expiresIn: 1440 // expires in 24 hours
        });

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
    // var PROJECTID = data.PROJECTID;
    var PROJECTNAME = data.data.PROJECTNAME;
    var MANAGER_EMP_ID = data.data.MANAGER_EMP_ID;
    var STARTDATE = data.data.STARTDATE;
    var ENDDATE = data.data.ENDDATE;
    var BILLED_ASSETS = data.data.BILLED_ASSETS;
    var BUDGET = data.data.BUDGET;
    var SALES = data.data.SALES;
    var PARTNER = data.data.PARTNER;
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
      "," +
      BUDGET +
      ",'" +
      PARTNER +
      "','" +
      SALES +
      "');";
    console.log(query);
    var request = new Request(query, function(err, rowCount, rows) {
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

router.post("/edit_project", (req, res, next) => {
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
    var PROJECTID = data.data.project_id;
    var PROJECTNAME = data.data[0];
    var MANAGER_EMP_ID = data.data[1];
    var STARTDATE = data.data[2];
    var ENDDATE = data.data[3];
    var BILLED_ASSETS = data.data[4];
    var BUDGET = data.data[5];

    var query =
      "UPDATE PROJECTS SET PROJECTNAME='" +
      PROJECTNAME +
      "',MANAGER_EMP_ID='" +
      MANAGER_EMP_ID +
      "',  STARTDATE='" +
      STARTDATE +
      "',ENDDATE='" +
      ENDDATE +
      "',BILLED_ASSETS='" +
      BILLED_ASSETS +
      "',BUDGET='" +
      BUDGET +
      "' where PROJECTID='" +
      PROJECTID +
      "'";
    console.log(query);

    var request = new Request(query, function(err, rowCount, rows) {});

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
    connection.execSql(request);
  }
});


// router.use((req, res, next) => {
//   // check header for the token
//   var token = req.headers["access-token"];

//   // decode token
//   if (token) {
//     // verifies secret and checks if the token is expired
//     jwt.verify(token, app.get("Secret"), (err, decoded) => {
//       if (err) {
//         return res.json({ message: "invalid token" });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     // if there is no token

//     res.send({
//       message: "No token provided."
//     });
//   }
// });

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
    var request = new Request("select * from projects", function(
      err,
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

router.get("/projectID", (req, res, next) => {
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
    var query = "select PROJECTNAME,PROJECTID from projects";
    var request = new Request(query, function(err, rowCount, rows) {
      console.log(query);
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

router.post("/remove", (req, res, next) => {
  var connection = new Connection(config);

  var PROJECTID = req.body.data;
  connection.on("connect", function(err) {
    if (err) {
      console.log(err);
    } else {
      queryDatabase();
      console.log("database connected");
    }
  });
  function queryDatabase() {
    var query = "DELETE FROM PROJECTS WHERE PROJECTID='" + PROJECTID + "'";
    console.log(query);
    var request = new Request(query, function(err, recordset, rowCount, rows) {
      res.send({ yes: "it works" });
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {});
    });

    connection.execSql(request);
  }
});

module.exports = router; //the router with routes is exported and can be used in other files
 