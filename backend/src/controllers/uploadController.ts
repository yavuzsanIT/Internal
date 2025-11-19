import { Request, Response } from 'express';
import excelService from '../services/excelService';

interface UploadRequest extends Request {
  file?: Express.Multer.File;
  body: {
    keywords: string;
  };
}

/**
 * Handles file upload and Excel processing
 * Validates keywords and delegates to excelService for processing
 */
const handleUpload = async (req: UploadRequest, res: Response): Promise<void> => {
  try {
    // Validate file upload
    if (!req.file) {
      res.status(400).json({ error: 'Dosya yüklenmedi.' });
      return;
    }

    const { keywords } = req.body;

    // Validate keywords
    if (!keywords || keywords.trim() === '') {
      res.status(400).json({ error: 'Arama kelimeleri eksik.' });
      return;
    }

    // Parse and validate keyword list
    const keywordList = keywords
      .split(',')
      .map((k: string) => k.trim())
      .filter((k: string) => k.length >= 2);

    if (keywordList.length === 0) {
      res.status(400).json({ error: 'En az bir geçerli arama kelimesi gerekli (min 2 karakter).' });
      return;
    }

    const uploadedPath = req.file.path;
    const originalFilename = req.file.originalname;

    // Process Excel file
    const newFilename = await excelService.processExcel(
      uploadedPath,
      keywordList,
      originalFilename
    );

    res.status(200).json({
      filename: newFilename,
      message: 'Dosya başarıyla işlendi.',
    });
  } catch (error: any) {
    console.error('Yükleme kontrolcüsü hatası:', error);
    res.status(500).json({
      error: error.message || 'Dosya işlenirken bir hata oluştu.',
    });
  }
};

export default { handleUpload };
