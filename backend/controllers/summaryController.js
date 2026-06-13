import Summary from '../models/Summary.js';
import mongoose from 'mongoose';
import { generateSummary } from '../services/geminiService.js';

const fallbackHistory = [];

export const createSummary = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Please provide valid content to summarize.' });
    }

    if (content.length > 20000) {
      return res.status(400).json({ error: 'Content is too long. Limit to 20,000 characters.' });
    }

    const summaryText = await generateSummary(content);

    // If MongoDB is not connected, return the summary without saving.
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
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      // If DB isn't connected, return fallback history instead of an error.
      return res.json(fallbackHistory);
    }

    const summaries = await Summary.find().sort({ createdAt: -1 }).limit(10);
    return res.json(summaries);
  } catch (error) {
    next(error);
  }
};
