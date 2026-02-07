import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CertificateManager from './pages/admin/CertificateManager';
import Projects from './pages/admin/Projects';
import Settings from './pages/admin/Settings';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/admin/PrivateRoute'
import TechStackManager from './pages/admin/TechStackManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="certificate" element={<CertificateManager />} />
          <Route path="projects" element={<Projects />} />
          <Route path="techstack" element={<TechStackManager />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
