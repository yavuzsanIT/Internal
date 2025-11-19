# YAVUZSAN Internal Tool - Backend

A modern Express.js + TypeScript backend server for processing Excel files and mapping OE numbers to YV codes using Google Sheets as a data source.

## Features

- ✅ File upload and validation (xlsx, xls, csv)
- ✅ Excel data processing with keyword filtering
- ✅ Integration with Google Sheets for real-time OE-YV mapping
- ✅ Result file generation and download
- ✅ Automatic cleanup of old files
- ✅ CORS support for cross-origin requests
- ✅ Comprehensive error handling
- ✅ Graceful shutdown
- ✅ Production-ready configuration

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── uploadController.ts       # Request handling logic
│   ├── routes/
│   │   └── uploadRoutes.ts           # API route definitions
│   ├── services/
│   │   ├── excelService.ts           # Excel processing logic
│   │   ├── GoogleSheetsService.ts    # Google Sheets integration
│   │   └── RemoverService.ts         # File cleanup logic
│   ├── utils/
│   │   ├── helpers.ts                # Utility functions
│   │   └── convertJson.ts            # Excel to JSON conversion
│   └── index.ts                      # Application entry point
├── data/
│   └── ORJ_NO.json                   # Local OE-YV mapping (fallback)
├── uploads/                          # Temporary uploaded files
├── outputs/                          # Generated result files
├── .env.development                  # Development config
├── .env.production                   # Production config
└── package.json                      # Dependencies
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Google Sheets with API access (optional, but recommended)

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env.development` and update values:
   ```bash
   cp .env.example .env.development
   ```

   Key variables:
   - `PORT`: Server port (default: 3000)
   - `NODE_ENV`: Environment (development/production)
   - `UPLOAD_DIR`: Directory for temporary uploads
   - `OUTPUT_DIR`: Directory for processed results
   - `VITE_GOOGLE_SHEETS_API_URL`: Google Sheets API endpoint
   - `VITE_GOOGLE_SHEETS_ID`: Your Google Sheet ID
   - `VITE_GOOGLE_SHEETS_SHEET_NAME`: Sheet name to read from

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Build & Production

Build TypeScript to JavaScript:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Upload & Process
```
POST /api/upload
```
**Parameters:**
- `file`: Excel file (.xlsx, .xls, .csv)
- `keywords`: Comma-separated keywords to search in column headers

**Response:**
```json
{
  "filename": "result-2025-01-15_10-30-45.xlsx"
}
```

### Download Result
```
GET /api/download/:filename
```
Downloads the processed Excel file.

## Configuration via Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment mode |
| UPLOAD_DIR | ./uploads | Upload directory |
| OUTPUT_DIR | ./outputs | Output directory |
| MAX_FILE_SIZE | 52428800 | Max file size (50MB) |
| CORS_ORIGIN | http://localhost:5173 | CORS allowed origin |
| VITE_GOOGLE_SHEETS_API_URL | https://opensheet.elk.sh | Google Sheets API |
| VITE_GOOGLE_SHEETS_ID | ... | Your Google Sheet ID |
| VITE_GOOGLE_SHEETS_SHEET_NAME | Sheet1 | Sheet name |

## Key Services

### excelService.ts
Handles the core Excel processing workflow:
1. Reads uploaded file
2. Extracts OE numbers using keyword filters
3. Finds YV matches from mapping
4. Adds results to original data
5. Generates output file

### GoogleSheetsService.ts
Fetches and caches OE-YV mappings from Google Sheets API for real-time data.

### RemoverService.ts
Automatically cleans up old files, keeping only the most recent ones.

## Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Error description in Turkish"
}
```

Common error codes:
- `400`: Bad request (missing file, invalid keywords)
- `404`: File not found
- `500`: Server error

## Logging

Development mode includes request logging. Check console for detailed logs.

## Security

- File type validation
- Path traversal protection
- CORS restriction
- File size limits
- Automatic cleanup of old files

## Contributing

1. Follow TypeScript strict mode
2. Add JSDoc comments to functions
3. Use meaningful error messages in Turkish
4. Test locally before pushing

## Support

For issues, contact: bilisim@yavuzsan.com
