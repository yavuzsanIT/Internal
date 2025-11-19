import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
  }, []);

  return {
    file,
    setFile,
    handleFileChange,
    handleDrop,
    clearFile,
  };
};

const isValidFileType = (file: File): boolean => {
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'];
  return validTypes.includes(file.type);
};
