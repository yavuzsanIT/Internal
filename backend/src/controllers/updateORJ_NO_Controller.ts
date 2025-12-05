import { Request, Response } from 'express';
import { updateOrjNoData } from '../services/updateORJ_NO_Service';


const handleUpdate_ORJ_NO = async (req: Request, res: Response) => {

    try {
        // Authentication and authorization
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            res.status(401).json({ error: 'Email veya şifre eksik.', status: 'failed' });
            return;
        }
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            console.log("Admin girişi yapıldı.");
        } else {
            res.status(401).json({ error: 'Lütfen geçerli bir email ve şifre ile girin.', status: 'failed' });
            return;
        }
        // Validate file upload
        if (!req.file) {
            res.status(400).json({ error: 'Dosya yükleyiniz => Örnek: ORJ_NO.xlsx', status: 'failed' });
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
            status: 'success',
        });

    } catch (error: any) {
        console.error('Yükleme kontrolcüsü hatası:', error);
        res.status(500).json({
            error: error.message || 'Dosya işlenirken bir hata oluştu.',
            status: 'failed'
        });
    }
}


export default { handleUpdate_ORJ_NO };