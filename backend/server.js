const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

const envPath = path.resolve(__dirname, '.env');
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.warn(`Warning: could not load backend environment file at ${envPath}.`);
  console.warn('Make sure backend/.env exists and the process has access to it.');
}

console.log('='.repeat(60));
console.log('BloodConnect CRM - Backend Initialization');
console.log('='.repeat(60));
console.log('PORT:', process.env.PORT || 'Not set (default: 5010)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Configured (Atlas/URI)' : '✗ Not configured');
console.log('AUTH_FALLBACK:', process.env.AUTH_FALLBACK === 'true' ? '✓ Enabled' : '✗ Disabled');
console.log('='.repeat(60));

const app = express();
// Strict CORS for local development and known frontends
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://localhost:4174', 'http://localhost:4177'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(require('./middleware/logger'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/chat', require('./routes/chat'));

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'BloodConnect CRM AI Backend' });
});

// Start server with fallback: try env PORT, else default 5010.
const DEFAULT_PORT = 5010;
const requestedPort = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

// Try a sequence of ports (DEFAULT_PORT..DEFAULT_PORT+9) if the preferred one is in use.
const MAX_ATTEMPTS = 10;

const startServer = (port, attempt = 0) => {
  const srv = app.listen(port, () => {
    console.log(`BloodConnect CRM AI server running on port ${port}`);
  });

  srv.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      if (attempt >= MAX_ATTEMPTS - 1) {
        console.error(`Port ${port} already in use and no fallback available. Exiting.`);
        process.exit(1);
      }
      const nextPort = DEFAULT_PORT + attempt + 1;
      console.warn(`Port ${port} is in use — trying port ${nextPort} instead.`);
      startServer(nextPort, attempt + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

const startApp = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error('⚠ MongoDB connection was not established. Auth fallback may be used if enabled.');
  }
  startServer(requestedPort);
};

startApp().catch((err) => {
  console.error('Fatal backend initialization error:', err);
  process.exit(1);
});
