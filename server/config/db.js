const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('====================================================');
    console.error('❌ DATABASE CONNECTION ERROR: MONGO_URI is missing!');
    console.error('👉 Fix: Go to Render Dashboard -> Environment tab');
    console.error('👉 Add Environment Variable: MONGO_URI=<your_mongodb_atlas_uri>');
    console.error('====================================================');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('====================================================');
    console.error(`❌ MONGODB CONNECTION ERROR: ${error.message}`);
    console.error('👉 Check that:');
    console.error('  1. Username & password in MONGO_URI are correct');
    console.error('  2. Network Access in MongoDB Atlas allows IP 0.0.0.0/0');
    console.error('====================================================');
    process.exit(1);
  }
};

module.exports = connectDB;
