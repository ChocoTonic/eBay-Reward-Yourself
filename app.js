const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const express = require("express");
const sass = require("node-sass");
const eBay = require("ebay-node-api");

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


const getItems = async (keyword)=>{
  try{
    await ebay.getAccessToken();
    const data = await ebay.searchItems({
      keyword: keyword,
      limit: 10,
      filter: 'price:[0..30], priceCurrency:USD'
      })
    const dataObj = await JSON.parse(data);

    return dataObj.itemSummaries;
  }catch(err){
    throw err;
  }
}


app.get("/", async (req, res)=>{

  // const items = await getItems("shirt");

  items = [
    {
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQhUXNVqxU9TjKSRkIGXsHtjqUQIppvUgM0xFstnjBmHMgUksGm&usqp=CAU",
      price: 5
    },
    {
      imageUrl: "https://lcw-ma.akinoncdn.com/products/2020/02/26/1417587/58694d16-f6a3-4db1-a9c2-cce9c99f765b_quality90.jpg",
      price: 10
    },
    {
      imageUrl: "https://cdn.shopify.com/s/files/1/0150/0643/3380/products/Viacom_Spongebob_PhoneCase-iPhone11ProTough_00905_82e34191-68db-472d-adf5-a4596d2b9e78_1024x1024.jpg?v=1573590965",
      price: 13
    },
    {
      imageUrl: "https://images.vans.com/is/image/Vans/D3HY28-HERO?$CATEGORY-LANDING-PRODUCT-REC$",
      price: 17
    },
    {
      imageUrl: "https://cdn11.bigcommerce.com/s-5b70d/images/stencil/1280x1280/products/786/5631/Baby-Alpaca-Mens-Color-Block-Scarf-Blue-Grey-by-Inca-Fashions-for-Sun-Valley-Alpaca-Loop__42287.1572118398.jpg?c=2?imbypass=on",
      price: 25
    }
  ];  
  res.render("pages/index", {
    items
  });
})


app.listen(port, ()=>{
  console.log("server started");
});
