# YAVUZSAN Internal Tool

A modern, full-stack application for searching and processing Excel files with OE-to-YV product code mapping.

**Frontend & Backend separated for independent deployment:**
- Frontend: Vite + React + TypeScript → **GitHub Pages**
- Backend: Express.js + TypeScript → **Render.io**

## Quick Start

### 1. Backend Setup (Port 3000)

```bash
cd backend
npm install
npm run dev
```

Backend will be available at `http://localhost:3000`

### 2. Frontend Setup (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Project Structure

```
Internal/
├── frontend/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── .env.development
│   ├── .env.production
│   └── README.md
├── backend/                  # Express backend
│   ├── src/
│   ├── data/
│   ├── uploads/
│   ├── outputs/
│   ├── .env.development
│   ├── .env.production
│   └── README.md
└── README.md                 # This file
```

## Technologies

### Frontend
- **Vite** - Lightning-fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **CSS** - Modern styling with CSS variables
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Multer** - File uploads
- **XLSX** - Excel processing
- **CORS** - Cross-origin support
- **Dotenv** - Environment management

## Key Features

✅ Upload Excel files (.xlsx, .xls, .csv)
✅ Search by column header keywords
✅ Real-time data integration via Google Sheets
✅ Generate processed Excel files
✅ Download results
✅ Automatic cleanup of old files
✅ Responsive mobile-friendly UI
✅ Dark theme with modern design
✅ Real-time validation
✅ Progress tracking

## API Endpoints

### Health Check
```
GET /api/health
```

### Upload & Process
```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: Excel file
- keywords: comma-separated keywords
```

### Download Results
```
GET /api/download/:filename
```

## Environment Configuration

### Backend (.env.development / .env.production)
```
PORT=3000
NODE_ENV=development
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs
CORS_ORIGIN=http://localhost:5173
VITE_GOOGLE_SHEETS_ID=your_sheet_id
VITE_GOOGLE_SHEETS_SHEET_NAME=Sheet1
```

### Frontend (.env.development / .env.production)
```
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
```

## Deployment

### Frontend to GitHub Pages

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The `dist/` folder is ready for GitHub Pages deployment.

### Backend to Render.io

1. Push backend code to GitHub
2. Connect Render.io to your repository
3. Set environment variables in Render dashboard
4. Deploy with `npm start` as start command

## Development Workflow

### Start both servers locally:

**Terminal 1 (Backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

### Production Build:

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm preview
```

## File Processing Workflow

1. User uploads Excel file
2. Specifies keywords to search in column headers
3. Backend reads file and filters columns
4. Extracts OE/product codes from relevant columns
5. Fetches OE-to-YV mapping from Google Sheets
6. Finds matches and adds YV codes to results
7. Generates output Excel file
8. User downloads result

## Directory Cleanup

- Output files: Keeps last 5 files
- Upload files: Keeps last 3 files
- Automatic cleanup after processing

## Error Handling

All errors include Turkish error messages for better UX:
- File validation errors
- Missing keyword errors
- Processing errors
- Network errors

## Security Features

- File type validation
- Path traversal protection
- CORS origin restriction
- File size limits
- Request timeout protection

## Support & Contact

Email: bilisim@yavuzsan.com

## Contributing

1. Use TypeScript strict mode
2. Add JSDoc comments
3. Write meaningful error messages
4. Test before deployment

## License

Internal use only - YAVUZSAN IT Department

---

**Last Updated:** November 2025
**Version:** 1.0.0
