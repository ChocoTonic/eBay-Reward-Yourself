"use strict";

const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const express = require("express");
const sass = require("node-sass");
const eBay = require("ebay-node-api");

const indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");

const app = express();
const port = 4000;
//render sass files 
const cssFilePath = path.join(__dirname, "/public/styles/main.css");
app.use((req, res, next)=>{
  sass.render({
    file: path.join(__dirname, "/utility/sass/main.scss"),
    outFile: cssFilePath
  }, (err, result)=>{
    if(err) throw err;
    fs.writeFile(cssFilePath, result.css, (err)=>{
      if(err) throw err;
      console.log("CSS COMPILED");
      next();
    })
  })
})

//set the view engine to ejs
app.set("view engine", "ejs");
//static assets root
app.use(express.static(path.join(__dirname, "public")));
dotenv.config();

const ebay = new eBay({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    body: {
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope'
  }
});


// const getItems = async (keyword)=>{
//   try{
//     await ebay.getAccessToken();
//     const data = await ebay.searchItems({
//       keyword: keyword,
//       limit: 10,
//       filter: 'price:[0..30], priceCurrency:USD'
//       })
//     const dataObj = await JSON.parse(data);

//     return dataObj.itemSummaries;
//   }catch(err){
//     throw err;
//   }
// }

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);


app.listen(port, ()=>{
  console.log("server started");
});
