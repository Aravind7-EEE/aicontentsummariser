import mongoose from 'mongoose';
import connectDB from '../backend/config/db.js';
import Summary from '../backend/models/Summary.js';
import { generateSummary } from '../backend/services/geminiService.js';

const fallbackHistory = global.__fallbackHistory || (global.__fallbackHistory = []);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { content } = req.body;

  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Please provide valid content to summarize.' });
  }

  if (content.length > 20000) {
    return res.status(400).json({ error: 'Content is too long. Limit to 20,000 characters.' });
  }

  await connectDB();
  const summaryText = await generateSummary(content);
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  if (!isDbConnected) {
    const summaryRecord = {
      _id: `fallback-${Date.now()}`,
      content,
      summary: summaryText,
      originalLength: content.length,
      summaryLength: summaryText.length,
      createdAt: new Date().toISOString(),
      saved: false
    };

    fallbackHistory.unshift(summaryRecord);
    if (fallbackHistory.length > 10) {
      fallbackHistory.pop();
    }

    return res.status(201).json(summaryRecord);
  }

  try {
    const savedSummary = await Summary.create({
      content,
      summary: summaryText,
      originalLength: content.length,
      summaryLength: summaryText.length
    });

    return res.status(201).json({
      summary: savedSummary.summary,
      originalLength: savedSummary.originalLength,
      summaryLength: savedSummary.summaryLength,
      createdAt: savedSummary.createdAt,
      saved: true
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to save summary.' });
  }
}
