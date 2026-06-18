#!/usr/bin/env node
/**
 * MongoDB Connection Tester
 * Quick utility to verify MongoDB configuration before starting the backend
 * 
 * Usage: node test-mongodb.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood_donor_crm';

console.log('\n' + '='.repeat(50));
console.log('  MongoDB Connection Tester');
console.log('='.repeat(50) + '\n');

console.log('📍 Configuration:');
console.log(`   MONGO_URI: ${mongoUri}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);

// Parse connection string for info
try {
  const url = new URL(mongoUri.replace(/^mongodb:/, 'http:').replace(/^mongodb\+srv:/, 'http:'));
  const isAtlas = mongoUri.includes('mongodb+srv');
  
  console.log('📊 Connection Details:');
  console.log(`   Type: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port || (isAtlas ? 'N/A (Atlas)' : '27017')}`);
  console.log(`   Database: ${mongoUri.split('/').pop().split('?')[0]}\n`);
} catch (err) {
  console.log('   ⚠️  Could not parse connection string\n');
}

// Attempt connection
console.log('🔄 Attempting connection...\n');

const connectDB = async () => {
  try {
    // Set options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    };

    // Connect
    await mongoose.connect(mongoUri, options);

    console.log('✅ CONNECTION SUCCESSFUL!\n');

    // Get connection info
    const connection = mongoose.connection;
    console.log('📌 Connection Info:');
    console.log(`   State: ${connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    console.log(`   Host: ${connection.host}`);
    console.log(`   Port: ${connection.port}`);
    console.log(`   Database: ${connection.db.getName()}\n`);

    // Try to execute a simple command
    console.log('🧪 Testing database access...');
    const adminDb = connection.db.admin();
    const serverStatus = await adminDb.serverStatus();
    console.log(`   Server Status: OK`);
    console.log(`   MongoDB Version: ${serverStatus.version}\n`);

    // List collections
    const collections = await connection.db.listCollections().toArray();
    console.log(`📦 Collections (${collections.length}):`);
    if (collections.length === 0) {
      console.log('   (No collections yet - will be created when data is inserted)\n');
    } else {
      collections.forEach(col => console.log(`   • ${col.name}`));
      console.log('');
    }

    console.log('='.repeat(50));
    console.log('  ✅ YOU\'RE READY TO GO! Start the backend with:');
    console.log('     npm run dev');
    console.log('='.repeat(50) + '\n');

    process.exit(0);

  } catch (error) {
    console.log('❌ CONNECTION FAILED!\n');

    console.log('⚠️  Error Details:');
    console.log(`   ${error.message}\n`);

    // Provide specific guidance based on error
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🔧 Local MongoDB is not running or not installed.');
      console.log('   Options:');
      console.log('   1. Run: mongod --dbpath "C:\\data\\db"');
      console.log('   2. Install MongoDB Community: https://www.mongodb.com/try/download/community');
      console.log('   3. Use MongoDB Atlas: See MONGODB_ATLAS_SETUP.md\n');

    } else if (error.message.includes('authentication failed')) {
      console.log('🔧 Authentication failed. Check your credentials:');
      console.log('   • Verify MONGO_URI in .env');
      console.log('   • Check username and password');
      console.log('   • Ensure user has database access permissions');
      console.log('   • For Atlas: Verify IP is whitelisted\n');

    } else if (error.message.includes('HOSTNAME_NOT_FOUND') || error.message.includes('getaddrinfo')) {
      console.log('🔧 Cannot resolve hostname. Check:');
      console.log('   • Internet connection');
      console.log('   • DNS settings');
      console.log('   • MONGO_URI for typos\n');

    } else if (error.message.includes('timeout')) {
      console.log('🔧 Connection timeout. Check:');
      console.log('   • Firewall settings (allow MongoDB on 27017)');
      console.log('   • Network connectivity');
      console.log('   • MongoDB service status\n');

    } else {
      console.log('🔧 Unknown error. Troubleshooting steps:');
      console.log('   1. Verify MONGO_URI in .env file');
      console.log('   2. Check MongoDB is running: netstat -ano | findstr 27017');
      console.log('   3. Check firewall settings');
      console.log('   4. Review full error message above\n');
    }

    console.log('📖 Documentation:');
    console.log('   • MONGODB_DIAGNOSTIC.md - Full troubleshooting guide');
    console.log('   • MONGODB_ATLAS_SETUP.md - Cloud setup (recommended)\n');

    console.log('='.repeat(50) + '\n');

    process.exit(1);
  }
};

// Run connection test
connectDB();
