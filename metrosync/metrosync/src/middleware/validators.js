const { body, param, query } = require('express-validator');

const loginValidators = [
  body('email')
    .exists({ checkFalsy: true }).withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  body('password')
    .exists({ checkFalsy: true }).withMessage('Password is required')
    .bail()
    .isString()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const listAnnouncementsValidators = [
  param('stationId').isMongoId().withMessage('stationId must be a valid id'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('since').optional().isISO8601().withMessage('since must be a valid date'),
];

const createAnnouncementValidators = [
  body('text')
    .exists({ checkFalsy: true }).withMessage('text is required')
    .bail()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('text must be 1-500 characters'),
  body('station')
    .exists({ checkFalsy: true }).withMessage('station is required')
    .bail()
    .isMongoId().withMessage('station must be a valid id'),
];

module.exports = {
  loginValidators,
  listAnnouncementsValidators,
  createAnnouncementValidators,
};
