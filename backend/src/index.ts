import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import uploadRoutes from './routes/uploadRoutes';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Initialize Express app
const app: Express = express();

// Environment variables
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ensure required directories exist
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), 'outputs');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`Created uploads directory: ${UPLOAD_DIR}`);
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created outputs directory: ${OUTPUT_DIR}`);
}

// ============ MIDDLEWARE ============

// CORS configuration
app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware (development only)
if (NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============ ROUTES ============

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

/**
 * Root endpoint
 */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'YAVUZSAN Internal Tool Backend',
    version: '1.0.0',
    status: 'running',
    environment: NODE_ENV,
  });
});

/**
 * Upload and processing routes
 */
app.use('/api', uploadRoutes);

// ============ ERROR HANDLING ============

/**
 * 404 Not Found handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: _req.path,
    method: _req.method,
  });
});

/**
 * Global error handler
 */
app.use((err: any, _req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============ SERVER STARTUP ============

const server = app.listen(PORT, () => {
  console.log(
    `
╔════════════════════════════════════════════╗
║  YAVUZSAN Internal Tool Backend            ║
║  Server listening on port ${PORT}             ║
║  Environment: ${NODE_ENV}                  ║
║  CORS Origin: ${CORS_ORIGIN}        ║
╚════════════════════════════════════════════╝
`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
