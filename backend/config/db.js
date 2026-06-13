import mongoose from 'mongoose';

const cache = global.__mongoose_cache || (global.__mongoose_cache = { conn: null, promise: null });

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('MONGO_URI is not defined in environment variables. Skipping MongoDB connection.');
    return;
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((mongooseInstance) => {
      cache.conn = mongooseInstance.connection;
      return cache.conn;
    });
  }

  try {
    return await cache.promise;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    cache.promise = null;
    return;
  }
};

export default connectDB;
