import React from 'react';

export function ScreenShell({ children }: { children: React.ReactNode }) {
  return <div className="screen-frame" style={{ height: 900 }}>{children}</div>;
}

// Placeholder for screens not yet fully built out — keeps routing/state
// wiring in place so each can be implemented incrementally.
export function StubScreen({ label }: { label: string }) {
  return (
    <ScreenShell>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, color: 'var(--color-neutral-600)' }}>Not yet implemented — see README for the design reference.</span>
      </div>
    </ScreenShell>
  );
}
