import React, { useCallback, useMemo, useState } from 'react';
import { updateOrjNoFile } from '../services/api'; // Henüz yok, birazdan ekleyeceğiz.

import { Alert } from '../hooks/useAlert';
import '../styles/UpdateOrjNoForm.css';
import { Progress } from './Progress';

// Helper: Basit dosya uzantısı kontrolü
const allowedExtensions = ['.xlsx', '.xls', '.csv'];
const isAllowedFile = (fileName: string) => {
    // 💡 DÜZELTME 2: Basit uzantı kontrolü için path modülüne bağımlı olmayan bir fonksiyon kullanıyoruz
    const simpleExt = '.' + fileName.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(simpleExt);
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


interface UpdateOrjNoFormProps {
    showAlert: (message: string, type: Alert['type']) => void;
}

export const UpdateOrjNoForm: React.FC<UpdateOrjNoFormProps> = ({ showAlert }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState('');

    // --- Durum Kontrolleri ---
    const isEmailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
    const isPasswordValid = useMemo(() => password.length >= 6, [password]);
    const isFileValid = useMemo(() => file !== null && isAllowedFile(file.name), [file]);

    const isFormValid = isEmailValid && isPasswordValid && isFileValid;

    // --- Handler'lar ---
    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    }, []);

    const handleClearFile = useCallback(() => {
        setFile(null);
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        showAlert('', 'success'); // Önceki alert'i temizle

        // 1. Durum Kontrolleri (Client Side What-If'ler)
        if (!file) {
            showAlert('Lütfen bir dosya seçin.', 'error');
            return;
        }
        if (!isAllowedFile(file.name)) {
            showAlert('Dosya formatı hatalı. Sadece .xlsx, .xls ve .csv desteklenir.', 'error');
            return;
        }
        if (!isEmailValid) {
            showAlert('Geçerli bir e-posta adresi girin.', 'error');
            return;
        }
        if (!isPasswordValid) {
            showAlert('Şifre en az 6 karakter olmalıdır.', 'error');
            return;
        }

        setIsSubmitting(true);
        setProgress(10);
        setProgressLabel('Dosya yükleniyor...');

        // 2. API İsteği
        try {
            // FormData: API'nin beklediği 'file', 'email' ve 'password' alanlarını ayarla
            const formData = new FormData();
            formData.append('file', file);
            formData.append('email', email); // Backend'de kimlik doğrulama için kullanılacak.
            formData.append('password', password); // Backend'de kimlik doğrulama için kullanılacak.

            // Not: Axios'ta progress bar için onUploadProgress kullanılabilir.
            const response = await updateOrjNoFile(formData, (p: number) => setProgress(p));

            setProgress(100);
            setProgressLabel('Tamamlandı!');
            showAlert(response.data.message || 'ORJ NO veri seti başarıyla güncellendi.', 'success');

            // Başarılı işlem sonrası temizlik
            setFile(null);
            setEmail('');
            setPassword('');

        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Güncelleme başarısız oldu';
            showAlert(`Hata: ${message}`, 'error');
            setProgress(0);
            setProgressLabel('');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setProgress(0);
                setProgressLabel('');
            }, 2000);
        }
    };


    // --- Render ---
    return (
        <div className="update-orj-no-container card">
            <button className="collapsible-header" onClick={handleToggle} disabled={isSubmitting}>
                <span className="title">ORJ NO Veri Seti Güncelleme</span>
                <span className="toggle-icon">{isOpen ? '▲ Kapat' : '▼ Aç'}</span>
            </button>

            {isOpen && (
                <div className="collapsible-content">
                    <p className="description">
                        Yeni ORJ NO verilerini (OE No, YV No) içeren bir Excel/CSV dosyası yükleyerek sistemdeki veri setini güncelleyin.
                    </p>
                    <p><strong> Bu işlem, sadece yetkili kullanıcılar içindir.</strong></p>
                    <hr className="section-divider" />

                    <form onSubmit={handleSubmit}>
                        {/* 1. Kimlik Doğrulama Inputları */}
                        <div className="input-group">
                            <label htmlFor="auth-email">E-posta:</label>
                            <input
                                id="auth-email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="yetkili@mail.com"
                                className={email.length > 0 && !isEmailValid ? 'input-error' : ''}
                                disabled={isSubmitting}
                                required
                            />
                            {email.length > 0 && !isEmailValid && (
                                <p className="error-message">Geçerli bir e-posta formatı gerekiyor.</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="auth-password">Şifre:</label>
                            <input
                                id="auth-password"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="******"
                                className={password.length > 0 && !isPasswordValid ? 'input-error' : ''}
                                disabled={isSubmitting}
                                required
                            />
                            {password.length > 0 && !isPasswordValid && (
                                <p className="error-message">Şifre en az 6 karakter olmalı.</p>
                            )}
                        </div>

                        {/* 2. Dosya Yükleme Inputu */}
                        <div className="input-group">
                            <label>Excel/CSV Dosyası (.xlsx, .xls, .csv):</label>
                            <div className="file-input-wrapper">
                                <input
                                    id="update-file-input"
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className={`btn btn-secondary ${!isFileValid && file ? 'btn-error' : ''}`}
                                    onClick={() => document.getElementById('update-file-input')?.click()}
                                    disabled={isSubmitting}
                                >
                                    {file ? `Seçilen: ${file.name}` : 'Dosya Seç'}
                                </button>
                                {file && (
                                    <button
                                        type="button"
                                        className="btn-clear-file"
                                        onClick={handleClearFile}
                                        disabled={isSubmitting}
                                    >
                                        Temizle
                                    </button>
                                )}

                            </div>
                            {!isFileValid && file && (
                                <p className="error-message">Sadece .xlsx, .xls ve .csv dosyaları desteklenmektedir.</p>
                            )}
                        </div>

                        <pre><strong>OEM numaralarının olduğu sütun başlığı  : "orjNo"</strong></pre>
                        <pre><strong>YV numaralarının olduğu sütun başlığı   : "yvNo"</strong></pre>

                        <hr className="section-divider" />

                        {/* 3. Gönder Butonu ve Progress */}
                        <div className="actions-section">
                            <button
                                className="btn btn-warning btn-large"
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? 'Güncelleniyor...' : 'VERİ SETİNİ GÜNCELLE'}
                            </button>
                        </div>

                        <Progress isVisible={progress > 0} progress={progress} label={progressLabel} />
                    </form>
                </div>
            )}
        </div>
    );
};

