import React from 'react';

interface AudioWaveformProps {
  isActive: boolean;
  isSpeaking: boolean;
  barsCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  isSpeaking,
  barsCount = 28
}) => {
  return (
    <div
      className="flex items-center justify-center gap-1 h-8 px-3 rounded-lg bg-black/40 border border-cyan-500/20"
      aria-label="Audio Frequency Spectrum"
    >
      {Array.from({ length: barsCount }).map((_, index) => {
        // Generate pseudo-random or reactive bar heights
        const baseHeight = isActive || isSpeaking ? Math.sin(index * 0.4) * 12 + 16 : 4;
        const animationDelay = `${(index * 0.05).toFixed(2)}s`;
        const barColor = isSpeaking
          ? 'bg-cyan-400'
          : isActive
          ? 'bg-blue-400'
          : 'bg-slate-700/60';

        return (
          <div
            key={index}
            className={`w-0.5 rounded-full transition-all duration-150 ${barColor}`}
            style={{
              height: `${Math.max(4, Math.min(26, baseHeight))}px`,
              animation:
                isActive || isSpeaking
                  ? `pulseGlow 0.8s ease-in-out infinite alternate`
                  : 'none',
              animationDelay
            }}
          />
        );
      })}
    </div>
  );
};
