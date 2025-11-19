import React, { useRef } from 'react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  file: File | null;
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  file,
  isDragging,
  onFileSelect,
  onDragEnter,
  onDragLeave,
  //onDrop,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragLeave();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const fileName = file.name.toLowerCase();
    return validTypes.includes(file.type) || validExtensions.some(ext => fileName.endsWith(ext));
  };

  return (
    <div className="file-upload-section">
      <h2>EXCEL İle Ara</h2>
      <p className="section-description">Desteklenen formatlar: .xlsx, .xls, .csv</p>

      <div
        className={`dropzone ${isDragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
        aria-label="Dosya sürükle-bırak alanı"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          className="file-input-hidden"
          aria-label="Dosya seç"
        />

        {!file ? (
          <div className="dropzone-content">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className="dropzone-text">
              <strong>Dosyanızı buraya sürükleyin & bırakın</strong>
              <p className="muted">veya</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              DOSYA SEÇ
            </button>
          </div>
        ) : (
          <div className="file-selected">
            <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <div className="file-info">
              <strong className="file-name">{file.name}</strong>
              <span className="file-size">{formatBytes(file.size)}</span>
            </div>
            <button
              type="button"
              className="btn-clear-file"
              onClick={onClear}
              aria-label="Dosyayı temizle"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
