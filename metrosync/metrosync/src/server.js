require('dotenv').config();
const http = require('http');
const createApp = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (err) {
    console.error('[server] Failed to connect to MongoDB, exiting.', err.message);
    process.exit(1);
  }

  const app = createApp();
  const httpServer = http.createServer(app);

  const corsOrigins = (process.env.CLIENT_ORIGIN || '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  initSocket(httpServer, corsOrigins.length ? corsOrigins : '*');

  httpServer.listen(PORT, () => {
    console.log(`[server] MetroSync backend listening on port ${PORT}`);
  });
}

start();
