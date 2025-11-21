import React, { useState, useCallback } from 'react';
// Dosya yolları düzeltildi: src/pages/ -> src/components/ için '../../components/...'
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FileUpload } from '../components/FileUpload';
import { KeywordInput } from '../components/KeywordInput';
import { Alert } from '../components/Alert';
import { Progress } from '../components/Progress';
import { Instructions } from '../components/Instructions';
import { OESearch } from '../components/OESearch';
import { uploadFile, downloadFile, searchOE } from '../services/api';
import { useAlert } from '../hooks/useAlert';
import '../styles/HomePage.css';

export const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [keywordErrors, setKeywordErrors] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [resultFilename, setResultFilename] = useState<string | null>(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResultFilename(null);
    setProgress(0);
    hideAlert();
  }, [hideAlert]);

  const handleDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setProgress(0);
    setProgressLabel('');
  }, []);

  const handleKeywordChange = useCallback((index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  }, [keywords]);

  const handleAddKeyword = useCallback(() => {
    setKeywords([...keywords, '']);
  }, [keywords]);

  const handleRemoveKeyword = useCallback((index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
    const newErrors = { ...keywordErrors };
    delete newErrors[index];
    setKeywordErrors(newErrors);
  }, [keywords, keywordErrors]);

  const validateKeyword = useCallback((index: number, value: string) => {
    const trimmed = value.trim();
    const errors: Record<number, string> = { ...keywordErrors };

    if (trimmed.length === 0) {
      delete errors[index];
    } else if (trimmed.length < 2) {
      errors[index] = 'En az 2 karakter olmalı';
    } else {
      const filledKeywords = keywords
        .map((k, i) => (i !== index ? k.trim() : trimmed))
        .filter((k) => k.length > 0);
      const hasDuplicate = filledKeywords.filter((k) => k === trimmed).length > 1;
      if (hasDuplicate) {
        errors[index] = 'Bu kelime zaten mevcut';
      } else {
        delete errors[index];
      }
    }

    setKeywordErrors(errors);
  }, [keywords, keywordErrors]);

  const handleUpload = async () => {
    hideAlert();

    if (!file) {
      showAlert('Lütfen bir dosya seçin', 'error');
      return;
    }

    const filledKeywords = keywords
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (filledKeywords.length === 0) {
      showAlert('Lütfen en az bir arama kelimesi girin', 'error');
      return;
    }

    if (Object.keys(keywordErrors).length > 0) {
      showAlert('Lütfen hataları düzeltin', 'error');
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setProgressLabel('Hazırlanıyor...');

    try {
      setProgress(20);
      setProgressLabel('Dosya yükleniyor...');

      const response = await uploadFile(file, filledKeywords);
      const { filename } = response.data;

      setProgress(100);
      setProgressLabel('Tamamlandı!');
      setResultFilename(filename);
      showAlert('Dosya başarıyla işlendi', 'success');

      setTimeout(() => {
        setProgress(0);
        setProgressLabel('');
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Yükleme başarısız oldu';
      showAlert(message, 'error');
      setProgress(0);
      setProgressLabel('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (resultFilename) {
      window.location.href = downloadFile(resultFilename);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="page-container">

          {/* Bölüm 1: OE No Arama (En üstte tam genişlikte yer alacak) */}
          <div className="oe-search-section card">
            <OESearch onSearch={searchOE} />
          </div>

          {/* Bölüm 2: Excel ile Ara ve Yan Panel (Instructions) */}
          <section className="card main-card">
                    
            <FileUpload
              file={file}
              isDragging={isDragging}
              onFileSelect={handleFileSelect}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={() => { }}
              onClear={handleClearFile}
            />

            <hr className="section-divider" />

            <KeywordInput
              keywords={keywords}
              onKeywordChange={handleKeywordChange}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              errors={keywordErrors}
              onValidate={validateKeyword}
            />

            <hr className="section-divider" />

            <div className="actions-section">
              <button
                className="btn btn-primary btn-large"
                onClick={handleUpload}
                disabled={isUploading || !file}
              >
                {isUploading ? 'İşleniyor...' : 'İŞLE & TARA'}
              </button>
              {resultFilename && (
                <button className="btn btn-success btn-large" onClick={handleDownload}>
                  SONUCU İNDİR
                </button>
              )}
            </div>

            <Progress isVisible={progress > 0} progress={progress} label={progressLabel} />

            {alert && (
              <Alert message={alert.message} type={alert.type} onClose={hideAlert} />
            )}
          </section>

          {/* Instructions artık sadece Excel ile Ara bölümünün yan panelidir. */}
          <aside className="instructions-sidebar">
            <Instructions />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};