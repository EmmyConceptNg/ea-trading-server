import express from'express';
import { accountStatus, index, show } from '../../controllers/admin/Users.js';

const router = express.Router();
router.get('/', index);
router.get('/:userId', show);
router.post('/account-status', accountStatus);

export default router;