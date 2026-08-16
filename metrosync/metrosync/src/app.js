const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const stationsRoutes = require('./routes/stations.routes');
const authRoutes = require('./routes/auth.routes');
const announcementsRoutes = require('./routes/announcements.routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  const corsOrigins = (process.env.CLIENT_ORIGIN || '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(helmet());
  app.use(cors({ origin: corsOrigins.length ? corsOrigins : '*' }));
  app.use(express.json());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Static passenger view / admin panel (simple demo frontends).
  app.use('/passenger', express.static(require('path').join(__dirname, '..', 'public', 'passenger')));
  app.use('/admin-panel', express.static(require('path').join(__dirname, '..', 'public', 'admin')));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'metrosync-backend', time: new Date().toISOString() });
  });

  app.use('/api/v1/stations', stationsRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/announcements', announcementsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
