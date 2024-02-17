import express from 'express';
import { ROI } from '../controllers/ROIController.js';

const router = express.Router();

router.get('/add-roi', ROI)


export default router;