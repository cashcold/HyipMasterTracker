import React from 'react';

interface RiskScoreGaugeProps {
  score: number;
  level?: string;
  size?: 'sm' | 'md' | 'lg' | 'circle';
  showDetails?: boolean;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score = 5.0,
  level,
  size = 'circle',
}) => {
  const normalizedScore = Math.max(0, Math.min(10, Number(score) || 0));

  // Determine color scheme based on 0-10 score (10 = Low Risk / Safe, 0 = High Risk / Scam)
  let bgClass = 'bg-[#86efac] text-[#065f46]'; // Light Green

  if (normalizedScore >= 7.0) {
    bgClass = 'bg-[#bbf7d0] text-[#166534] border border-[#86efac]'; // Green
  } else if (normalizedScore >= 4.0) {
    bgClass = 'bg-[#fef08a] text-[#854d0e] border border-[#fde047]'; // Olive / Amber
  } else if (normalizedScore >= 2.0) {
    bgClass = 'bg-[#fecdd3] text-[#9f1239] border border-[#fda4af]'; // Salmon / Coral
  } else {
    bgClass = 'bg-[#f87171] text-white border border-[#ef4444]'; // Red
  }

  if (size === 'circle') {
    return (
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 shadow-xs ${bgClass}`}
        title={`Risk Score: ${normalizedScore.toFixed(1)} / 10`}
      >
        {normalizedScore.toFixed(1)}
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div
        className={`px-1.5 py-0.5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${bgClass}`}
      >
        {normalizedScore.toFixed(1)}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shrink-0 shadow-sm ${bgClass}`}
      >
        {normalizedScore.toFixed(1)}
      </div>
    );
  }

  return (
    <div
      className={`px-2 py-0.5 rounded-full inline-flex items-center justify-center font-black text-xs ${bgClass}`}
    >
      {normalizedScore.toFixed(1)}
    </div>
  );
};
