import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './styles/cortex.css';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home/Home'));
const CRM = lazy(() => import('./pages/CRM/CRM'));
const HRM = lazy(() => import('./pages/HRM/HRM'));
const Finance = lazy(() => import('./pages/Finance/Finance'));
const Growth = lazy(() => import('./pages/Growth/Growth'));
const BrainPage = lazy(() => import('./pages/Brain/Brain'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const Agents = lazy(() => import('./pages/Agents/Agents'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const DataPlatform = lazy(() => import('./pages/DataPlatform/DataPlatform'));
const Chatbot = lazy(() => import('./pages/Chatbot/Chatbot'));
const Services = lazy(() => import('./pages/Services/Services'));

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: '#94a3b8',
        fontSize: '14px',
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="crm" element={<CRM />} />
          <Route path="hrm" element={<HRM />} />
          <Route path="finance" element={<Finance />} />
          <Route path="growth" element={<Growth />} />
          <Route path="brain" element={<BrainPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="agents" element={<Agents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="data-platform" element={<DataPlatform />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
