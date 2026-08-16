require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@metrosync.local').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('[seed:admin] Connected to MongoDB');

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`[seed:admin] Admin ${email} already exists, skipping.`);
      return;
    }

    const passwordHash = await Admin.hashPassword(password);
    const admin = await Admin.create({ email, passwordHash, role: 'admin', name: 'MetroSync Admin' });
    console.log(`[seed:admin] Created admin ${admin.email}`);
  } catch (err) {
    console.error('[seed:admin] Failed to create admin:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[seed:admin] Disconnected');
  }
}

createAdmin();
