import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LicenciaProvider } from './context/LicenciaContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import AgentePage from './pages/AgentePage';
import JefePage from './pages/JefePage';
import AyudaPage from './pages/AyudaPage';

function App() {
  return (
    <LicenciaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="agente" element={<AgentePage />} />
            <Route path="jefe" element={<JefePage />} />
            <Route path="ayuda" element={<AyudaPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </LicenciaProvider>
  );
}

export default App;