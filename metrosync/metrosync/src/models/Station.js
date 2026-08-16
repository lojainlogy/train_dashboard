const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    line: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Red", "Blue", "Line 1"
    },
    order: {
      type: Number,
      required: true,
      // position of this station along its line, used for sorting
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

stationSchema.index({ line: 1, order: 1 });

module.exports = mongoose.model('Station', stationSchema);
