import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import uploadController from '../controllers/uploadController';
import { find_single_YV_Codes } from '../services/InstantSearchService';
import { getUploadMulter } from './Helpers';

const router: Router = express.Router();

// Setup multer storage configuration
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), 'outputs');

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Configure multer
const uploadMulter = getUploadMulter(uploadDir);


/**
 * POST /api/upload
 * Uploads and processes an Excel file with keywords
 */
router.post('/upload', uploadMulter.single('file'), uploadController.handleUpload);

/**
 * GET /api/download/:filename
 * Downloads the processed Excel file
 */
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      res.status(400).json({ error: 'Geçersiz dosya adı.' });
      return;
    }

    const filePath = path.resolve(outputDir, filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Dosya bulunamadı.' });
      return;
    }

    // Verify file is within output directory (security check)
    const realPath = fs.realpathSync(filePath);
    const realOutputDir = fs.realpathSync(outputDir);
    if (!realPath.startsWith(realOutputDir)) {
      res.status(400).json({ error: 'Geçersiz dosya yolu.' });
      return;
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download hatası:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Dosya indirilemedi.' });
        }
      }
    });
  } catch (error: any) {
    console.error('Download kontrolcüsü hatası:', error);
    res.status(500).json({ error: error.message || 'Bir hata oluştu.' });
  }
});

/**
 * POST /api/search-oe
 * Searches for YV codes matching a given OE number
 */
router.post('/search-oe', async (req: Request, res: Response) => {
  try {
    const { oeNumber } = req.body;

    if (!oeNumber || typeof oeNumber !== 'string') {
      res.status(400).json({ error: 'OE numarası gereklidir.' });
      return;
    }

    // Delegate to the instant search service. The implementation of
    // `findYVCodes` is intentionally left as a placeholder for manual
    // implementation; it should return an array of matching YV codes.
    const results = await find_single_YV_Codes(oeNumber);

    res.status(200).json({
      oeNumber: oeNumber.trim(),
      yvCodes: Array.isArray(results) ? results : [],
      found: Array.isArray(results) ? results.length > 0 : false,
    });
  } catch (error: any) {
    console.error('OE arama hatası:', error);
    res.status(500).json({
      error: error.message || 'OE aranırken bir hata oluştu.',
    });
  }
});

export default router;
