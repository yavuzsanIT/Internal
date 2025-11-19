import React, { useState } from 'react';
import '../styles/OESearch.css';
import { normalize_OE } from '../utils/Helpers';

interface SearchResult {
  oe: string;
  yvCodes: string[];
}

interface OESearchProps {
  onSearch: (oeNumber: string) => Promise<string[]>;
  isLoading?: boolean;
}

export const OESearch: React.FC<OESearchProps> = ({ onSearch, isLoading = false }) => {
  const [oeInput, setOeInput] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    // Clear previous results
    setSearchError(null);
    setResults(null);

    // Validate input
    const trimmedInput = oeInput.trim();
    if (!trimmedInput) {
      setSearchError('Lütfen bir OE numarası girin.');
      return;
    }

    if (trimmedInput.length < 2) {
      setSearchError('OE numarası en az 2 karakter olmalı.');
      return;
    }

    setIsSearching(true);

    try {
      const yvCodes = await onSearch(trimmedInput);

      if (yvCodes && yvCodes.length > 0) {
        setResults({
          oe: trimmedInput,
          yvCodes,
        });
        setSearchError(null);
      } else {
        setSearchError(`"${trimmedInput}" için sonuç bulunamadı.`);
        setResults(null);
      }
    } catch (error: any) {
      setSearchError(error.message || 'Arama sırasında bir hata oluştu.');
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setOeInput('');
    setResults(null);
    setSearchError(null);
  };

  return (
    <div className="oe-search-section">
      <h2>OE No Ara</h2>
      <p className="section-description">OE numarasını girin ve karşılık gelen YV kodlarını görün</p>

      <div className="oe-search-container">
        <div className="oe-search-input-wrapper">
          <input
            type="text"
            className={`oe-search-input ${searchError ? 'input-error' : ''}`}
            placeholder="Örn: OE001, OEM123"
            value={oeInput}
            onChange={(e) => setOeInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching || isLoading}
            aria-label="OE numarası giriş alanı"
          />
          <button
            className="btn btn-primary oe-search-btn"
            onClick={handleSearch}
            disabled={isSearching || isLoading || !oeInput.trim()}
            aria-label="Arama yap"
          >
            {isSearching ? 'Aranıyor...' : 'ARA'}
          </button>
        </div>

        {searchError && <div className="oe-search-error">{searchError}</div>}

        {results && (
          <div className="oe-search-results">
            <div className="results-header">
              <strong>OE Numarası:</strong>
              <span className="oe-code">{normalize_OE(results.oe)}</span>
            </div>

            <div className="results-content">
              <div className="yv-codes-label">Karşılık Gelen YV Kodları:</div>
              <div className="yv-codes-list">
                {results.yvCodes.map((yvCode, index) => (
                  <a href={`https://www.yavuzsan.com/tr/urunler?search=${yvCode}`} target="_blank" rel="noopener noreferrer">
                    <div key={index} className="yv-code-badge">
                      {yvCode}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <button
              className="btn btn-secondary oe-clear-btn"
              onClick={handleClear}
              aria-label="Aramayı temizle"
            >
              Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OESearch;
