import multer from 'multer';
import path from 'path';

/// === multer helpers === ///

export function storage(uploadDir: string) {
    return multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            cb(null, `${name}-${timestamp}${ext}`);
        },
    });
}


export function getUploadMulter(uploadDir: string) {
    return multer({
        storage: storage(uploadDir),
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB default
        },
        fileFilter: (_req, file, cb) => {
            // Accept only Excel and CSV files
            const allowedMimes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv',
            ];
            const allowedExtensions = ['.xlsx', '.xls', '.csv'];

            const ext = path.extname(file.originalname).toLowerCase();
            const isAllowedExt = allowedExtensions.includes(ext);
            const isAllowedMime = allowedMimes.includes(file.mimetype);

            if (isAllowedExt || isAllowedMime) {
                cb(null, true);
            } else {
                cb(new Error('Sadece .xlsx, .xls ve .csv dosyaları desteklenmektedir.'));
            }
        },
    })
}