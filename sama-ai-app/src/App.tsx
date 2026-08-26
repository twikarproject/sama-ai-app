import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DevNav } from './components/DevNav';
import { Login } from './screens/Login';
import { PreJoin } from './screens/PreJoin';
import { LiveTranslation } from './screens/LiveTranslation';
import { StubScreen } from './components/ScreenShell';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={
        <div style={{ padding: '24px 0 60px' }}>
          <DevNav />
          <div style={{ padding: '24px 0' }}>
            <Routes>
              <Route path="pre-join" element={<PreJoin />} />
              <Route path="translation" element={<LiveTranslation />} />
              <Route path="applause" element={<StubScreen label="03 · Applause" />} />
              <Route path="activity" element={<StubScreen label="04 · Activity" />} />
              <Route path="qa" element={<StubScreen label="05 · Q&A + Notes" />} />
              <Route path="cockpit" element={<StubScreen label="06 · Speaker Cockpit" />} />
              <Route path="studio" element={<StubScreen label="07 · Engagement Studio" />} />
              <Route path="digest" element={<StubScreen label="08 · Question Digest" />} />
              <Route path="host" element={<StubScreen label="09 · Host Control Room" />} />
              <Route path="recap" element={<StubScreen label="10 · Recap" />} />
              <Route path="*" element={<Navigate to="/pre-join" replace />} />
            </Routes>
          </div>
        </div>
      } />
    </Routes>
  );
}
