const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

const allowedOrigins = new Set();
if (process.env.FRONTEND_URL) {
  allowedOrigins.add(process.env.FRONTEND_URL);
}
if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => allowedOrigins.add(origin));
}
const renderOriginRegex = /^https:\/\/[a-z0-9-]+\.onrender\.com$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin) || renderOriginRegex.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: origin not allowed (${origin})`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(require('./middleware/logger'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dispatch', require('./routes/dispatch'));

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'BloodConnect CRM AI Backend' });
});

if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
  console.log('Serving frontend from:', frontendBuildPath);
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

const PORT = parseInt(process.env.PORT, 10) || 5010;

const startServer = (port) => {
  const srv = app.listen(port, () => {
    console.log(`BloodConnect CRM AI server running on port ${port}`);
  });

  srv.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
};

(async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('⚠ MongoDB connection was not established. Auth fallback may be used if enabled.');
  }
  startServer(PORT);
})();
