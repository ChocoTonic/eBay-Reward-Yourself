const express = require("express");
const router = express.Router();

//controllers
const product_controller = require("../controllers/ProductController");

//home page 
router.get("/",product_controller.index_get);

//about page route
router.get("/about", (req, res)=>{
  res.render("pages/about");
})

//contact page route
router.get("/contact", (req, res)=>{
  res.render("pages/contact");
})


module.exports = router;