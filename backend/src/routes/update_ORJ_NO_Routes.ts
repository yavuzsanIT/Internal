import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import updateORJ_NO_Controller from '../controllers/updateORJ_NO_Controller';
import { getUploadMulter } from './Helpers';

const router: Router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data');


// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Configure multer
const uploadMulter = getUploadMulter(uploadDir);


router.post('/update-orj-no', uploadMulter.single('file'), updateORJ_NO_Controller.handleUpdate_ORJ_NO);


export default router;