const express = require('express');
const router = express.Router();
const { listStations } = require('../controllers/stations.controller');

// GET /api/v1/stations - public
router.get('/', listStations);

module.exports = router;
