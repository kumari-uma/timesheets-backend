const express = require("express");
const bodyParser = require("body-parser");
const jwt    = require('jsonwebtoken');
// const config = require('./configurations/config');


  
// const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token"
  );
  next();
});
app.use(cors());
app.use(bodyParser.json());
 app.use(
   bodyParser.urlencoded({
     extended: true
   })
 );
 

const employeeRoutes = require("./modals/employee");
const timesheetRoutes = require("./modals/timesheets");
const projectRoutes = require("./modals/project");
const adminRoutes = require("./modals/admin_timesheets");
const admininfoRoutes = require("./modals/admin_info");

// app.set("Secret", config.secret);

app.use("/employee", employeeRoutes);

app.use("/admin", adminRoutes);
app.use("/timesheet", timesheetRoutes);
app.use("/project", projectRoutes);
app.use("/admin_info", admininfoRoutes);




// console.log(token);
 
 
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
}); //it is used to provide the proper error msg format


module.exports = app;
 //https://dev.to/medaymentn/securing-your-node-js-api-with-json-web-token-5o5