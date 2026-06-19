const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Initialize Express app
const app = express();

console.log('='.repeat(60));
console.log('BloodConnect CRM - Backend Starting');
console.log('='.repeat(60));
console.log('PORT:', process.env.PORT || '5010 (default)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ Not set');
console.log('='.repeat(60));

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:4174',
    'http://localhost:4177',
    'https://bc-crm-final-2026-8.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(require('./middleware/logger'));

// 1. API Routes FIRST (under /api namespace)
try {
  app.use('/api', require('./routes'));
  console.log('✓ All API routes loaded');
} catch (err) {
  console.error('✗ Failed to load routes:', err.message);
  process.exit(1);
}

// 2. Serve React build (static files)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

// 3. SPA Fallback (VERY IMPORTANT - must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err.message);
      res.status(500).json({ 
        error: 'Frontend not available',
        details: 'frontend/dist/index.html not found. Build may not have completed.'
      });
    }
  });
});

// Error handler (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
const PORT = parseInt(process.env.PORT, 10) || 5010;

const startServer = async () => {
  // Connect to database
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('⚠ Database connection failed. Auth fallback may be used.');
  }

  // Start listening on 0.0.0.0 (required for Render)
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`✓ Frontend dist: ${distPath}`);
    console.log('Ready to serve requests!\n');
  });

  server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
