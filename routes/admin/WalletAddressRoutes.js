import express from 'express'
import { createWallet, index } from '../../controllers/WalletAddressesController.js';

const router = express.Router();

router.get('/', index);
router.post('/', createWallet);



export default router;  