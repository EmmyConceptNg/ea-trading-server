import express from 'express'
import {
  index,
  toggleStatus,
} from "../../controllers/admin/AdminWithdrawalsController.js";


const router = express.Router()

router.get('/', index);
router.post('/status', toggleStatus);

export default router;