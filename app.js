"use strict";
const path = require("path");
const express = require("express");

const indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");
const errorRouter = require("./routes/error");

const sassCompiler = require("./utility/sass/sass-compiler");

const app = express();
const PORT = 8080;
//compile sass files 
(async()=>{
  await sassCompiler();
})()

//set the view engine to ejs
app.set("view engine", "ejs");
//static assets root
app.use(express.static(path.join(__dirname, "public")));




//handle client requests
app.use("/", indexRouter);
app.use("/catalog", catalogRouter);
app.use(errorRouter);


app.listen(PORT, ()=>{
  console.log(`server started: port ${PORT}`);
});
