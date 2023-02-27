const express = require("express");
const app = express();
// const router = express.Router();

app.use((req, res, next) => {
  req.requestTime = new Date();
  //   console.log("LOG: ", new Date());
  next();
});
// define the home page route
app.get("/", (req, res) => {
  let responseText = `Requested at ${req.requestTime}`;
  res.send(responseText);
});
// define the about route
app.get("/about", (req, res) => {
  res.send("About birds");
});

module.exports = app;
