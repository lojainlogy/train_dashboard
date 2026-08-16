const express = require('express');
const router = express.Router();
const { listAnnouncements, createAnnouncement } = require('../controllers/announcements.controller');
const requireAdmin = require('../middleware/requireAdmin');
const {
  listAnnouncementsValidators,
  createAnnouncementValidators,
} = require('../middleware/validators');

// GET /api/v1/announcements/station/:stationId - public read
router.get('/station/:stationId', listAnnouncementsValidators, listAnnouncements);

// POST /api/v1/announcements - protected, admin only
router.post('/', requireAdmin, createAnnouncementValidators, createAnnouncement);

module.exports = router;
