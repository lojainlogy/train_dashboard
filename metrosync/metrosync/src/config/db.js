const mongoose = require('mongoose');

async function connectDB(uri) {
  mongoose.connection.on('connected', () => {
    console.log(`[db] Mongoose connected to ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[db] Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] Mongoose disconnected');
  });

  try {
    await mongoose.connect(uri, {
      // Modern mongoose (8.x) no longer needs useNewUrlParser/useUnifiedTopology,
      // they are defaults, but serverSelectionTimeoutMS is worth setting explicitly.
      serverSelectionTimeoutMS: 10000,
    });
    console.log('[db] Connection successful, database is ready to serve requests');
  } catch (err) {
    console.error('[db] Initial connection failed:', err.message);
    throw err;
  }
}

module.exports = connectDB;
