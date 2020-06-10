const express = require('express');
const errorController = require('../controllers/errorController');

const router = express.Router();

router.get('*', errorController.notFoundPage);


module.exports = router;
