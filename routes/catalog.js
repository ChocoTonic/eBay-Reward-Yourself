const express = require("express");
const router = express.Router();

//controller modules
const product_controller = require("../controllers/ProductController");

//Product Routes
 
//get catalog home page
router.get("/", product_controller.index);


module.exports = router;