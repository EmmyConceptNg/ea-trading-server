import express from 'express';
import { getImage, kyc, kycStatus, login, register } from '../controllers/Auth.js';
import multer from 'multer';
import path from 'path';
const router = express.Router()



// Set up multer middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size (in bytes)
}).fields([
  { name: "profileImage", maxCount: 1 }, // For image files
  { name: "identityImage", maxCount: 1 }, // For document files
]);


router.post('/register', register)
router.post('/login', login)
router.post('/kyc', upload, kyc)
router.get('/uploads/:imageName', getImage)
router.get('/kyc-status/:userId', kycStatus)

export default router