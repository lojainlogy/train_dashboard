const stationsService = require('../services/stations.service');

async function listStations(req, res, next) {
  try {
    const stations = await stationsService.getAllStations();
    res.status(200).json({ success: true, count: stations.length, data: stations });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStations };
