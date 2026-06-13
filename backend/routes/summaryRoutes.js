import express from 'express';
import { createSummary, getHistory } from '../controllers/summaryController.js';

const router = express.Router();

router.post('/summarize', createSummary);
router.get('/history', getHistory);

export default router;
