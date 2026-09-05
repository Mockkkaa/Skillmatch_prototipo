import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { PublicOnlyRoute, ProtectedRoute } from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Ofertas from './pages/public/Ofertas';
import VacanteDetalle from './pages/public/VacanteDetalle';

// Dashboard Pages (Aprendiz)
import DashboardAprendiz from './pages/aprendiz/Dashboard';
import PerfilAprendiz from './pages/aprendiz/Perfil';
import HojaVida from './pages/aprendiz/HojaVida';
import Formacion from './pages/aprendiz/Formacion';
import Experiencia from './pages/aprendiz/Experiencia';
import MisPostulaciones from './pages/aprendiz/MisPostulaciones';

// Empresa Pages
import DashboardEmpresa from './pages/empresa/Dashboard';
import VacantesEmpresa from './pages/empresa/Vacantes';
import NuevaVacante from './pages/empresa/NuevaVacante';
import PostulacionesRecibidas from './pages/empresa/PostulacionesRecibidas';
import PerfilEmpresa from './pages/empresa/Perfil';

// Admin Pages
import DashboardAdmin from './pages/admin/Dashboard';
import UsuariosAdmin from './pages/admin/Usuarios';
import EmpresasAdmin from './pages/admin/Empresas';
import VacantesAdmin from './pages/admin/Vacantes';
import ReportesAdmin from './pages/admin/Reportes';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/ofertas" element={<PublicLayout><Ofertas /></PublicLayout>} />
            <Route path="/ofertas/:id" element={<PublicLayout><VacanteDetalle /></PublicLayout>} />
            
            {/* Rutas de Autenticación */}
            <Route 
              path="/login" 
              element={<PublicOnlyRoute><AuthLayout title="Iniciar Sesión"><Login /></AuthLayout></PublicOnlyRoute>} 
            />
            <Route 
              path="/register" 
              element={<PublicOnlyRoute><AuthLayout title="Registro de Aprendiz"><Register /></AuthLayout></PublicOnlyRoute>} 
            />
            <Route 
              path="/register-empresa" 
              element={<PublicOnlyRoute><AuthLayout title="Registro Empresarial"><Register isEmpresa={true} /></AuthLayout></PublicOnlyRoute>} 
            />

            {/* Rutas Aprendiz */}
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['APRENDIZ']}>
                <DashboardLayout><DashboardAprendiz /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute roles={['APRENDIZ']}>
                <DashboardLayout><PerfilAprendiz /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/hoja-de-vida" element={
              <ProtectedRoute roles={['APRENDIZ']}>
                <DashboardLayout><HojaVida /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/formacion" element={
              <ProtectedRoute roles={['APRENDIZ']}>
                <DashboardLayout><Formacion /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/experiencia" element={
              <ProtectedRoute roles={['APRENDIZ']}>
                <DashboardLayout><Experiencia /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/postulaciones" element={
              <ProtectedRoute roles={['APRENDIZ']}>
                <DashboardLayout><MisPostulaciones /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Rutas Empresa */}
            <Route path="/empresa" element={
              <ProtectedRoute roles={['EMPRESA']}>
                <DashboardLayout><DashboardEmpresa /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/empresa/perfil" element={
              <ProtectedRoute roles={['EMPRESA']}>
                <DashboardLayout><PerfilEmpresa /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/empresa/vacantes" element={
              <ProtectedRoute roles={['EMPRESA']}>
                <DashboardLayout><VacantesEmpresa /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/empresa/vacantes/nueva" element={
              <ProtectedRoute roles={['EMPRESA']}>
                <DashboardLayout><NuevaVacante /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/empresa/vacantes/:id" element={
              <ProtectedRoute roles={['EMPRESA']}>
                <DashboardLayout><NuevaVacante isEdit={true} /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/empresa/postulaciones" element={
              <ProtectedRoute roles={['EMPRESA']}>
                <DashboardLayout><PostulacionesRecibidas /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Rutas Administrador & Funcionario */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMINISTRADOR', 'FUNCIONARIO']}>
                <DashboardLayout><DashboardAdmin /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute roles={['ADMINISTRADOR']}>
                <DashboardLayout><UsuariosAdmin /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/empresas" element={
              <ProtectedRoute roles={['ADMINISTRADOR', 'FUNCIONARIO']}>
                <DashboardLayout><EmpresasAdmin /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/vacantes" element={
              <ProtectedRoute roles={['ADMINISTRADOR', 'FUNCIONARIO']}>
                <DashboardLayout><VacantesAdmin /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reportes" element={
              <ProtectedRoute roles={['ADMINISTRADOR', 'FUNCIONARIO']}>
                <DashboardLayout><ReportesAdmin /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* 404 & Redirections */}
            <Route path="/acceso-denegado" element={
              <div style={{ padding: '50px', textAlign: 'center' }}>
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos para ver esta página.</p>
                <br/>
                <a href="/">Volver al inicio</a>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
