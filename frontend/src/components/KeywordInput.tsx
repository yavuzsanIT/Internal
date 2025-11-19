import React from 'react';
import '../styles/KeywordInput.css';

interface KeywordInputProps {
  keywords: string[];
  onKeywordChange: (index: number, value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  errors: Record<number, string>;
  onValidate: (index: number, value: string) => void;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  keywords,
  onKeywordChange,
  onAddKeyword,
  onRemoveKeyword,
  errors,
  onValidate,
}) => {
  return (
    <div className="keyword-section">
      <h2>Sütun Başlıklarında Aranacak Kelimeler</h2>
      <p className="section-description">
        Excel dosyanızdaki taranacak sütunların başlıklarında yer alacak kelimeler
      </p>

      <div className="keyword-list">
        {keywords.map((keyword, index) => (
          <div key={index} className="keyword-item">
            <div className="keyword-input-wrapper">
              <input
                type="text"
                className={`keyword-input ${errors[index] ? 'input-error' : ''}`}
                placeholder="Örn: OE, OEM, TRW, Cross-Code"
                value={keyword}
                onChange={(e) => {
                  onKeywordChange(index, e.target.value);
                  onValidate(index, e.target.value);
                }}
                aria-label={`Arama kelimesi ${index + 1}`}
              />
              {keywords.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-keyword"
                  onClick={() => onRemoveKeyword(index)}
                  aria-label={`Kelimeyi sil: ${keyword}`}
                >
                  ✕
                </button>
              )}
            </div>
            {errors[index] && (
              <div className="error-message">{errors[index]}</div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onAddKeyword}
        aria-label="Yeni kelime ekle"
      >
        + Yeni Kelime Ekle
      </button>
    </div>
  );
};
