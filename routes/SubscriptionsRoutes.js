import express from 'express'
import { index } from '../controllers/SubscriptionsController.js'

const router = express.Router()

router.get('/:userId', index);

export default router;