import mongoose from 'mongoose';
import connectDB from '../backend/config/db.js';
import Summary from '../backend/models/Summary.js';

const fallbackHistory = global.__fallbackHistory || (global.__fallbackHistory = []);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  await connectDB();
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  if (!isDbConnected) {
    return res.status(200).json(fallbackHistory);
  }

  try {
    const summaries = await Summary.find().sort({ createdAt: -1 }).limit(10);
    return res.status(200).json(summaries);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to load history.' });
  }
}
