const Station = require('../models/Station');

/**
 * Fetch every station, sorted by line then by order,
 * so the frontend can render lines in the correct sequence.
 */
async function getAllStations() {
  return Station.find({}).sort({ line: 1, order: 1 }).lean();
}

async function getStationById(id) {
  return Station.findById(id).lean();
}

module.exports = {
  getAllStations,
  getStationById,
};
