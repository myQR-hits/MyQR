// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mysql = require("mysql");
const passport = require("passport");
const qr = require("qrcode");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// sql connection

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "MY-QR",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connection done");
  } else {
    console.log("Connection failed");
  }
});

// initial routes

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/forgot_pass", function (req, res) {
  res.render("f_pass");
});

app.get("/admin_panel", function (req, res) {
  res.render("admin");
});

app.get("/list", function (req, res) {
  res.render("list");
});

app.get("/create_product", function (req, res) {
  res.render("create_product");
});

app.get("/qr_display", function (req, res) {
  res.render("qr_diaplay");
});

app.get("/qr_reader", function (req, res) {
  res.render("qr_reader");
});

// difinition routes end here

// login

app.post("/register", function (req, res) {
  const email = req.body.email;
  const name = req.body.name;
  const work = req.body.work;
  const phone = req.body.phone;
  const password = req.body.password;
  console.log(email + "  reg" + "\n");

  mysqlConnection.query("INSERT INTO user_auth (username, password) Values ('" + email + "','" + password + "')", function (err, result) {
    if (!err) {
      mysqlConnection.query("INSERT INTO user_details (email, name, phone, work) Values ('" + email + "','" + name + "','" + phone + "','" + work + "' )", function (err, result) {
        if (!err) {
          res.render("admin");
        } else {
          res.render("err", { err: err });
        }
      });
    } else {
      if (err.code === "ER_DUP_ENTRY") {
        res.render("err", { err: "DUPLICATE" });
      }
      console.log(err);
      res.render("err", { err: err });
    }
  });
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email + "  log" + "\n");

  mysqlConnection.query("SELECT * FROM user_auth WHERE username ='" + email + "' and password = '" + password + "'", function (err, result) {
    if (!err) {
      res.render("admin");
    } else {
      if (err.code === "ER_DUP_ENTRY") {
        res.render("err", { err: "DUPLICATE" });
      }
      console.log(err);
      res.render("err", { err: err });
    }
  });
});

app.post("/generate", (req, res) => {
  const f_1 = req.body.f_1;
  const f_2 = req.body.f_2;
  const f_3 = req.body.f_3;
  const f_4 = req.body.f_4;
  const f_5 = req.body.f_5;
  const f_6 = req.body.f_6;
  const f_7 = req.body.f_7;
  const f_8 = req.body.f_8;
  const qty = req.body.qty;

  const f_string = f_1+"&"+f_2+"&"+f_3+"&"+f_4+"&"+f_5+"&"+f_6+"&"+f_7+"&"+f_8 ;

  console.log(qty);

  if (f_string.length === 0) res.send("Empty Data!");
  qr.toDataURL(f_string, (err, src) => {
      if (err) res.send("Error occured");

      res.render("qr_display", { src });
  });
});

// connection started here
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("port started successfully");
});
