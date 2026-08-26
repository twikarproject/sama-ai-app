import React from 'react';

export function Logo({ size = 28 }: { size?: number }) {
  const tile = size, icon = size * 0.6;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: tile, height: tile, borderRadius: tile * 0.28, background: '#383838', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="#dbea8d">
          <rect x="5" y="7.6" width="4" height="2.6" rx="1.3" />
          <rect x="10.2" y="7.6" width="4.6" height="2.6" rx="1.3" />
          <rect x="16" y="7.6" width="3" height="2.6" rx="1.3" />
          <rect x="5" y="13.6" width="14" height="2.6" rx="1.3" />
        </svg>
      </span>
      <span style={{ fontSize: size * 0.68, fontWeight: 600, letterSpacing: '-.03em' }}>
        Sama<span style={{ color: '#6d7a3a' }}>.ai</span>
      </span>
    </span>
  );
}
