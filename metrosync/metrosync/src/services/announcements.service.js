const Announcement = require('../models/Announcement');

/**
 * Get announcements for a station, newest-first, with pagination and
 * optional date-range filtering.
 */
async function getAnnouncementsForStation(stationId, { page = 1, limit = 20, since } = {}) {
  const query = { station: stationId };
  if (since) {
    query.timestamp = { $gte: new Date(since) };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Announcement.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('station', 'name line')
      .lean(),
    Announcement.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

async function createAnnouncement({ text, station, createdBy }) {
  const announcement = await Announcement.create({ text, station, createdBy });
  return announcement.populate('station', 'name line');
}

module.exports = {
  getAnnouncementsForStation,
  createAnnouncement,
};
