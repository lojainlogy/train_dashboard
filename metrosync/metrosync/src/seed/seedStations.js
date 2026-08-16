require('dotenv').config();
const mongoose = require('mongoose');
const Station = require('../models/Station');

const stations = [
  { name: 'Central Terminal', line: 'Red', order: 1, code: 'RED01' },
  { name: 'Market Square', line: 'Red', order: 2, code: 'RED02' },
  { name: 'Harborview', line: 'Red', order: 3, code: 'RED03' },
  { name: 'University', line: 'Red', order: 4, code: 'RED04' },
  { name: 'North Gate', line: 'Red', order: 5, code: 'RED05' },

  { name: 'Riverside', line: 'Blue', order: 1, code: 'BLU01' },
  { name: 'Old Town', line: 'Blue', order: 2, code: 'BLU02' },
  { name: 'Tech Park', line: 'Blue', order: 3, code: 'BLU03' },
  { name: 'Airport Junction', line: 'Blue', order: 4, code: 'BLU04' },

  { name: 'Eastside', line: 'Green', order: 1, code: 'GRN01' },
  { name: 'Museum District', line: 'Green', order: 2, code: 'GRN02' },
  { name: 'Stadium', line: 'Green', order: 3, code: 'GRN03' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('[seed] Connected to MongoDB');

    await Station.deleteMany({});
    const inserted = await Station.insertMany(stations);
    console.log(`[seed] Inserted ${inserted.length} stations`);
  } catch (err) {
    console.error('[seed] Failed to seed stations:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[seed] Disconnected');
  }
}

seed();
