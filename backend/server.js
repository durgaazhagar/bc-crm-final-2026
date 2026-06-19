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
// CORS configuration - allow Render deployment and localhost for development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:4174',
  'http://localhost:4177',
  'https://bc-crm-final-2026-8.onrender.com',
  process.env.FRONTEND_URL // Allow custom frontend URL if set
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(require('./middleware/logger'));

// Load routes with error handling
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✓ Auth route loaded');
  app.use('/api/donors', require('./routes/donors'));
  console.log('✓ Donors route loaded');
  app.use('/api/emergency', require('./routes/emergency'));
  console.log('✓ Emergency route loaded');
  app.use('/api/dispatch', require('./routes/dispatch'));
  console.log('✓ Dispatch route loaded');
  app.use('/api/analytics', require('./routes/analytics'));
  console.log('✓ Analytics route loaded');
  app.use('/api/ai', require('./routes/ai'));
  console.log('✓ AI route loaded');
  app.use('/api/chat', require('./routes/chat'));
  console.log('✓ Chat route loaded');
} catch (err) {
  console.error('✗ Error loading routes:', err.message);
  console.error(err.stack);
  process.exit(1);
}

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', service: 'BloodConnect CRM AI Backend' });
});

app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'BloodConnect CRM Backend is live'
  });
});

// Serve frontend static files
// __dirname is backend/ when run as "node backend/server.js" from root
// So we need to go up one level to reach frontend/dist
const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');
console.log(`Static files path: ${distPath}`);
app.use(express.static(distPath));

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err.message);
      res.status(500).json({ 
        error: 'Frontend not available', 
        details: 'Build may still be in progress or dist folder is missing',
        distPath: distPath
      });
    }
  });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server with fallback: try env PORT, else default 5010.
const DEFAULT_PORT = 5010;
const requestedPort = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

const startServer = (port, attempt = 0) => {
  // Render requires binding to 0.0.0.0, not localhost
  const srv = app.listen(port, '0.0.0.0', () => {
    console.log(`BloodConnect CRM AI server running on port ${port}`);
    console.log(`Listen address: 0.0.0.0:${port}`);
  });

  srv.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      if (attempt >= 9) {
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
  console.log('Initializing database connection...');
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('⚠ MongoDB connection was not established. Auth fallback may be used if enabled.');
  } else {
    console.log('✓ MongoDB connected successfully');
  }
  
  console.log(`Starting server on port ${requestedPort}...`);
  startServer(requestedPort);
};

startApp().catch((err) => {
  console.error('Fatal backend initialization error:', err);
  process.exit(1);
});
