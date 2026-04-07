import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Upload from './components/Upload/Upload';
import Requests from './components/Requests/Requests';
import Issues from './components/Issues/Issues';
import Waterfall from './components/Waterfall/Waterfall';
import Domains from './components/Domains/Domains';
import Identity from './components/Identity/Identity';
import AI from './components/AI/AI';
import Metrics from './components/Metrics/Metrics';
import Compare from './components/Compare/Compare';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/waterfall" element={<Waterfall />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/identity" element={<Identity />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
