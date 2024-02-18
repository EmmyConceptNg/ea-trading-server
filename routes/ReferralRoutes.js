import express from 'express';
import { validateReferral } from '../controllers/ReferralController.js';

const router = express.Router();

router.get("/:referral", validateReferral);

export default router;