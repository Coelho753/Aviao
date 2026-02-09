const express = require('express');
const flightController = require('../controllers/flightController');

const router = express.Router();

router.get('/flights/search', flightController.searchFlights);

module.exports = router;
