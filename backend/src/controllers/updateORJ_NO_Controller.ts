import { Request, Response } from 'express';
import { updateOrjNoData } from '../services/updateORJ_NO_Service';


const handleUpdate_ORJ_NO = async (req: Request, res: Response) => {
    try {
        // Validate file upload
        if (!req.file) {
            res.status(400).json({ error: 'Dosya yükleyiniz => Örnek: ORJ_NO.xlsx' });
            return;
        }

        const uploadedPath = req.file.path;
        const originalFilename = req.file.originalname;

        // Process the uploaded file (e.g., save to a database, etc.)
        // use service layer
        await updateOrjNoData(uploadedPath);

        res.status(200).json({
            message: 'Dosya yükleme islemi tamamlandı.',
            filename: originalFilename,
        });

    } catch (error: any) {
        console.error('Yükleme kontrolcüsü hatası:', error);
        res.status(500).json({
            error: error.message || 'Dosya işlenirken bir hata oluştu.',
        });
    }
}


export default { handleUpdate_ORJ_NO };