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

// Create connection to database
 var contents = fs.readFileSync("authentication.json");
 var jsonContent = JSON.parse(contents);
  

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

router.post("/timesheet", (req, res, next) => {
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
    var TIMESHEETID = data.timesheet_id;
    var PROJECTID = data.project_id;
    var EMP_ID = data.emp_id;
    var BILL_DATE = data.bill_date;
    var TASK_TYPE = data.task_type;
    var BILLED_HOURS = data.billed_hours;
    var TASK_DESCRIPTION = data.task_description;
    var ISAPPROVED = data.approved1;
    var APPROVED_BY_EMP_ID = data.app_emp;
    var rows_number = 0;

    var query1 = "SELECT * FROM EMPLOYEES WHERE  emp_id='" + EMP_ID + "';";

    // Read all rows from table
    var request = new Request(query1, function(err, rowCount, rows) {
      console.log(rowCount);
    });

    var query =
      "INSERT INTO TIMESHEETS VALUES(" +
      TIMESHEETID +
      "," +
      PROJECTID +
      ",'" +
      EMP_ID +
      "','" +
      BILL_DATE +
      "','" +
      TASK_TYPE +
      "'," +
      BILLED_HOURS +
      ",'" +
      TASK_DESCRIPTION +
      "','" +
      ISAPPROVED +
      "','" +
      APPROVED_BY_EMP_ID +
      "');";

    var request = new Request(query, function(err, rowCount, rows) {
      console.log("insert query is called");
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
    connection.execSql(request);
  }
});

router.post("/timesheets", (req, res, next) => {
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
    var emp_id = req.body.data;
    var query1 = "SELECT * FROM TIMESHEETS WHERE  emp_id='" + emp_id + "';";

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


//this route is used to get all the data which is to be approved by employee which is logged in

router.post("/approve", (req, res, next) => {
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
    var emp_id = req.body.data;
    var query1 =
      "SELECT * FROM TIMESHEETS WHERE  APPROVED_BY_EMP_ID='" + emp_id + "';";

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

//this route is used to approve the timesheets

router.post("/approval", (req, res, next) => {
  var connection = new Connection(config);

  var isAPPROVED = req.body.data.aa;
  var time_id = req.body.data.pp; 
  connection.on("connect", function(err) {
    if (err) {
      console.log(err);
    } else {
      queryDatabase();
      console.log("database connected");
    }
  });
  function queryDatabase() {
    var query =
      "UPDATE TIMESHEETS SET ISAPPROVED='" +
      isAPPROVED +
      "' where  TIMESHEETID='" +
      time_id +
      "'";

    var request = new Request(query, function(err, recordset, rowCount, rows) {
      res.send({ ggheheh: "fghjb" });
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        var column_name = column.metadata.colName;
        var column_data = column.value;
      });
    });

    connection.execSql(request);
  }
});

module.exports = router; //the router with routes is exported and can be used in other files
