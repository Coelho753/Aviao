const express = require('express');
const flightController = require('../controllers/flightController');

const router = express.Router();

router.get('/flights/search', flightController.searchFlights);
router.get('/flights/airports', flightController.listAirports);
router.get('/flights/search-config', flightController.getSearchConfig);

module.exports = router;
