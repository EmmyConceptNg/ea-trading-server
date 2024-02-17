import express from 'express';
import { index } from '../../controllers/admin/AdminDashboardController.js';


const router = express.Router()

router.get('/', index)

export default router