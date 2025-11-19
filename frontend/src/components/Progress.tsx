import React from 'react';
import '../styles/Progress.css';

interface ProgressProps {
  isVisible: boolean;
  progress: number;
  label: string;
}

export const Progress: React.FC<ProgressProps> = ({ isVisible, progress, label }) => {
  if (!isVisible) return null;

  return (
    <div className="progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-percentage">{progress}%</span>
      </div>
      <div className="progress-bar-wrapper">
        <progress className="progress-bar" max="100" value={progress} />
      </div>
    </div>
  );
};
