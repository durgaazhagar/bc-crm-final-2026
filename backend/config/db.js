const mongoose = require('mongoose');

let isConnected = false;

mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connection event: connected');
  isConnected = true;
});

mongoose.connection.on('error', (error) => {
  console.error('✗ MongoDB connection event: error', error);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB connection event: disconnected');
  isConnected = false;
});

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const mongoUri = primaryUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodconnect';

  if (!primaryUri) {
    console.warn('\n⚠ MONGO_URI is not configured. Falling back to MONGODB_URI or local MongoDB default.');
    console.warn('  Please set MONGO_URI in backend/.env or environment for Atlas connection.');
  }

  if (mongoUri.includes('<user>') || mongoUri.includes('<password>')) {
    console.warn('\n⚠ WARNING: MONGO_URI contains placeholder values. Please update with actual MongoDB Atlas credentials.');
  }

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.warn(`\n⚠ WARNING: MONGO_URI format looks invalid. Expected a MongoDB URI starting with mongodb:// or mongodb+srv://.`);
    console.warn(`  Received: ${mongoUri}`);
  }

  const uriType = mongoUri.includes('localhost') ? 'local MongoDB' : 'MongoDB Atlas';
  console.log(`\n📍 Attempting ${uriType} connection...`);

  const maxRetries = parseInt(process.env.DB_MAX_RETRIES, 10) || 5;
  const delayMs = parseInt(process.env.DB_INITIAL_DELAY_MS, 10) || 2000;

  const tryConnect = async (attempt = 1) => {
    try {
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log(`✅ MongoDB connected successfully on ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.db.name}`);
      return true;
    } catch (error) {
      isConnected = false;
      console.error(`❌ MongoDB connection error (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt >= maxRetries) {
        console.error(`\n⛔ FATAL: MongoDB failed to connect after ${maxRetries} attempts.`);
        console.error(`Server will run in degraded mode.`);
        console.error(`AUTH_FALLBACK=${process.env.AUTH_FALLBACK === 'true' ? 'ENABLED (in-memory mode)' : 'DISABLED (will reject requests)'}\n`);
        return false;
      }
      
      const nextAttempt = attempt + 1;
      console.warn(`⏳ Retrying MongoDB connection in ${delayMs / 1000}s (attempt ${nextAttempt}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return tryConnect(nextAttempt);
    }
  };

  return tryConnect();
};

// Helper to check connection state elsewhere in the app if needed
const isDBConnected = () => isConnected;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
