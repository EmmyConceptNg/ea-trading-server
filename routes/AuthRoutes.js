import express from 'express';
import {
  getImage,
  kyc,
  kycStatus,
  login,
  register,
  subscriptionStatus,
} from "../controllers/Auth.js";
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


const handleMulterError = function (err, req, res, next) {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    // Handle file size limit exceeded error
    console.error("Multer Error:", err);
    return res.status(400).json({ error: "File size exceeds the limit" });
  }
  next();
};


router.use(handleMulterError)


router.post('/register', register)
router.post('/login', login)
router.post('/kyc',(req, res, next)=> {
  upload(req, res, function(err) {
    if (err) {
      // Handle Multer errors
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        console.error("Multer Error:", err);
        return res.status(400).json({ error: "File size exceeds the limit" });
      }
      // Handle other errors
      next(err);
    } else {
      // No Multer errors, proceed with KYC handling
      kyc(req, res, next);
    }
  });
});
router.get('/uploads/:imageName', getImage)
router.get('/kyc-status/:userId', kycStatus)
router.get('/subscription-status/:userId', subscriptionStatus)

export default router