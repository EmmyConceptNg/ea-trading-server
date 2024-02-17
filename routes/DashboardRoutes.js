import express from 'express';
import { index } from '../controllers/DashboardController.js';


const router = express.Router()

router.get('/:userId', index)

export default router