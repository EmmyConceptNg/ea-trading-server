import express from 'express'
import { index, requestWithdrawal } from '../controllers/WithdrawalsController.js'

const router = express.Router()

router.get('/:userId', index);
router.post('/request', requestWithdrawal);

export default router;
