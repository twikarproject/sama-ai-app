import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  ['/pre-join', '01 Pre-join'],
  ['/translation', '02 Live Translation'],
  ['/applause', '03 Applause'],
  ['/activity', '04 Activity'],
  ['/qa', '05 Q&A + Notes'],
  ['/cockpit', '06 Speaker Cockpit'],
  ['/studio', '07 Engagement Studio'],
  ['/digest', '08 Question Digest'],
  ['/host', '09 Host Control Room'],
  ['/recap', '10 Recap'],
] as const;

// Dev-only screen switcher. Remove once real navigation (join links, host
// controls, etc.) replaces jumping directly between screens.
export function DevNav() {
  return (
    <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '10px 24px', borderBottom: '1px solid var(--color-divider)', background: 'var(--color-bg)' }}>
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          fontSize: 12.5, color: isActive ? 'var(--color-accent-700)' : 'var(--color-neutral-700)',
          borderBottom: isActive ? '1px solid var(--color-accent)' : '1px solid transparent', paddingBottom: 2,
        })}>{label}</NavLink>
      ))}
    </nav>
  );
}
