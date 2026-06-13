import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import summaryRoutes from './routes/summaryRoutes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

connectDB();

app.use('/api', summaryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI Content Summarizer API is running.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
