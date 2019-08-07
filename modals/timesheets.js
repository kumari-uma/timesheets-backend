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
  server: jsonContent.server, // update me
  options: {
    database: jsonContent.database,
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
    console.log(data);
    var PROJECTID = data.data.project_id;
    console.log(PROJECTID);
    var EMP_ID = data.data.emp_id;
    var BILL_DATE = data.data.bill_date;
    var TASK_TYPE = data.data.task_type;
    var BILLED_HOURS = data.data.billed_hours;
    var TASK_DESCRIPTION = data.data.task_description;
    var ISAPPROVED = data.data.approved1;
    var LAST_UPDATED = data.data.last_updated;
    var APPROVED_BY_EMP_ID = "";

    var query1 = "SELECT * FROM EMPLOYEES WHERE  emp_id='" + EMP_ID + "';";

    // Read all rows from table
    var request = new Request(query1, function(err, rowCount, rows) {
      console.log(query1);
      console.log(rowCount);
    });

    var query =
      "INSERT INTO TIMESHEETS VALUES(" +
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
      LAST_UPDATED +
      "','" +
      APPROVED_BY_EMP_ID +
      "');";

    var request = new Request(query, function(err, rowCount, rows) {
      console.log("insert query is called");
      console.log(query);
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
    // var query1 =
    //   "SELECT *,cast([bill_date] As varchar(12))  As bill_date FROM TIMESHEETS WHERE  emp_id='" +
    //   emp_id +
    //   "';"; 
      var query2 =
        "select a.projectname , b.*,cast([bill_date] As varchar(12))  As bill_date from projects as a join timesheets as b on a.projectid = b.projectid where b.emp_id='" +
        emp_id +
        "';"; 
    var request = new Request(query2, function(err, recordset, rowCount, rows) {
      res.send(dataget);
      console.log(query2);
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
    var query2 =
      "select * from TimeSheets where projectid = (select projectid from projects where manager_emp_id = '" +
      emp_id +
      "');";
    var request = new Request(query2, function(err, recordset, rowCount, rows) {
      res.send(dataget);
      console.log(query2);
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
  console.log(req.body.data);
  var isAPPROVED = req.body.data.aa;
  var time_id = req.body.data.pp;
  var APPROVED_BY_EMP_ID = req.body.data.approved_id;

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
      "', APPROVED_BY_EMP_ID ='" +
      APPROVED_BY_EMP_ID +
      "' where  TIMESHEETID='" +
      time_id +
      "'";

    var request = new Request(query, function(err, recordset, rowCount, rows) {
      res.send({ yes: "it works" });
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

router.post("/remove", (req, res, next) => {
  var connection = new Connection(config);

  var TIMESHEETID = req.body.data;
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
      "DELETE FROM TIMESHEETS WHERE TIMESHEETID='" + TIMESHEETID + "'";

    var request = new Request(query, function(err, recordset, rowCount, rows) {
      res.send({ yes: "it works" });
    });

    request.on("row", function(columns) {
      columns.forEach(function(column) {});
    });

    connection.execSql(request);
  }
});

router.post("/edit_timesheet", (req, res, next) => {
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
    console.log(data.data);
    console.log(data);
    var TIMESHEETID = data.data.timesheet_id;
    var PROJECTID = data.data[0];

    var EMP_ID = data.data[1];
    var BILL_DATE = data.data[2];
    var TASK_TYPE = data.data[3];
    var BILLED_HOURS = data.data[4];
    var ISAPPROVED = "N";
    var TASK_DESCRIPTION = data.data[6];

    var query =
      "UPDATE TIMESHEETS SET PROJECTID='" +
      PROJECTID +
      "',EMP_ID='" +
      EMP_ID +
      "',  BILL_DATE ='" +
      BILL_DATE +
      "',TASK_TYPE='" +
      TASK_TYPE +
      "',BILLED_HOURS='" +
      BILLED_HOURS +
      "',TASK_DESCRIPTION ='" +
      TASK_DESCRIPTION +
      "',ISAPPROVED='" +
      ISAPPROVED +
      "' where TIMESHEETID='" +
      TIMESHEETID +
      "'";

    var request = new Request(query, function(err, rowCount, rows) {});

    request.on("row", function(columns) {
      columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
      });
    });
    connection.execSql(request);
  }
});

//this api is used to get the type of tasks in timesheets
router.get("/task_types", (req, res, next) => {
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
  var query ="select * from task_types"
    var request = new Request(query, function(err, recordset, rowCount, rows) {
      res.send(dataget);
      console.log(dataget);
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
