const express = require("express");
const router = express.Router();

//controller modules
const catalogController = require("../controllers/catalogController");

//Product Routes
 
//get catalog home page
router.get("/", catalogController.index);

//about page route
router.get("/about", (req, res)=>{
  res.render("pages/about", {
    path: "/catalog/about"
  });
})

//contact page route
router.get("/contact", (req, res)=>{
  res.render("pages/contact",{
    path: "/catalog/contact"
  });
})


module.exports = router;