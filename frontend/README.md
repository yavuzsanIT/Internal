# YAVUZSAN Internal Tool - Frontend

A modern Vite + React + TypeScript frontend application for searching and processing Excel files with product data.

## Features

- ✅ Modern, responsive UI with dark theme
- ✅ Real-time form validation
- ✅ Drag-and-drop file upload
- ✅ Dynamic keyword input management
- ✅ Progress tracking during processing
- ✅ File download functionality
- ✅ Alert notifications (success, error, info)
- ✅ Mobile-friendly design
- ✅ TypeScript for type safety
- ✅ Environment-based configuration

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Alert.tsx
│   │   ├── FileUpload.tsx
│   │   ├── KeywordInput.tsx
│   │   ├── Progress.tsx
│   │   └── Instructions.tsx
│   ├── pages/               # Page components
│   │   └── HomePage.tsx
│   ├── services/            # API integration
│   │   └── api.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useFileUpload.ts
│   │   └── useAlert.ts
│   ├── types/               # TypeScript interfaces
│   │   └── api.ts
│   ├── styles/              # CSS modules
│   │   ├── global.css
│   │   ├── Header.css
│   │   ├── Footer.css
│   │   ├── Alert.css
│   │   ├── FileUpload.css
│   │   ├── KeywordInput.css
│   │   ├── Progress.css
│   │   ├── Instructions.css
│   │   └── HomePage.css
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/
│   └── images/              # Static images
├── .env.development         # Development config
├── .env.production          # Production config
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   
   Update `.env.development` for local development:
   ```
   VITE_API_URL=http://localhost:3000
   VITE_API_TIMEOUT=30000
   ```

   Update `.env.production` for production deployment:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_API_TIMEOUT=30000
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Build for Production

Build and optimize:

```bash
npm run build
```

Preview production build:

```bash
npm preview
```

## Deployment

### GitHub Pages (Frontend)

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the optimized production build ready for GitHub Pages deployment.

3. Configure your GitHub repository settings to deploy from the `dist/` folder.

### Render.io (Backend)

The backend is configured to run on Render.io with environment variables.

## Features Overview

### Home Page
- **File Upload Section**: Drag-and-drop or click to select Excel files
- **Keyword Input**: Add multiple search keywords
- **Processing**: Start the file processing
- **Download**: Download results once processing is complete
- **Instructions**: Step-by-step guide in sidebar

### Validation
- Keyword must be at least 2 characters
- No duplicate keywords allowed
- File type validation (xlsx, xls, csv)
- Real-time error messages

### Styling
- Modern dark theme (Slate-900 background)
- Responsive grid layout
- Smooth transitions and animations
- Accessibility features (ARIA labels)

## API Integration

The frontend communicates with the backend via:

```typescript
POST /api/upload
GET /api/download/:filename
```

Environment variable `VITE_API_URL` controls the backend URL.

## Custom Hooks

### useFileUpload
Manages file selection and drag-and-drop functionality.

### useAlert
Manages notification toasts (success, error, info).

## Component Communication

- `HomePage` is the main orchestrator
- Components are controlled by props
- State management via React hooks
- No external state library (Redux/Zustand)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:3000 | Backend API URL |
| VITE_API_TIMEOUT | 30000 | Request timeout (ms) |

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting with Vite
- Lazy loading of components
- Optimized CSS with minimal dependencies
- No bloated UI frameworks

## SEO & Accessibility

- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Meta tags in index.html

## Contributing

1. Use TypeScript for type safety
2. Keep components small and focused
3. Add comments for complex logic
4. Test responsive design at 320px+

## Support

For issues or questions, contact: bilisim@yavuzsan.com
