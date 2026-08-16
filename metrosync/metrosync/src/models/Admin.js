const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Instance helper: compare a plain-text password against the stored bcrypt hash.
adminSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Static helper: hash a plain-text password for storage (used by seed scripts / creation).
adminSchema.statics.hashPassword = function hashPassword(plainPassword) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

module.exports = mongoose.model('Admin', adminSchema);
