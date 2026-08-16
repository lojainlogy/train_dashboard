const { validationResult } = require('express-validator');
const announcementsService = require('../services/announcements.service');
const { getIO } = require('../sockets');

async function listAnnouncements(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { stationId } = req.params;
    const { page, limit, since } = req.query;

    const result = await announcementsService.getAnnouncementsForStation(stationId, {
      page,
      limit,
      since,
    });

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function createAnnouncement(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { text, station } = req.body;
    const announcement = await announcementsService.createAnnouncement({
      text,
      station,
      createdBy: req.admin?.id,
    });

    // Broadcast to everyone currently viewing this station's room, in real time,
    // right after the write succeeds, so REST and sockets stay in sync.
    const io = getIO();
    if (io) {
      io.to(`station:${station}`).emit('newAnnouncement', announcement);
    }

    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAnnouncements, createAnnouncement };
