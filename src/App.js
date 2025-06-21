import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActividadesPage from './pages/ActividadesPage';
import PersonasPage from './pages/PersonasPage';
import RegistroPersonaPage from './pages/RegistroPersonaPage';
import EditarPersonasPage from './pages/EditarPersonasPage';
import RegistroEquipoPage from './pages/RegistroEquipoPage';
import EditarEquiposPage from './pages/EditarEquiposPage';
import ReportesPage from './pages/ReportesPage';
import PerfilPage from './pages/PerfilPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RedirectToDashboard from './pages/RedirectToDashboard';
import RegistroFasePage from './pages/RegistroFasePage';
import EditarFasesPage from './pages/EditarFasesPage';
import RegistroParalizacionPage from './pages/RegistroParalizacionPage';
import EditarParalizacionesPage from './pages/EditarParalizacionesPage';
import RegistroStandbyPage from './pages/RegistroStandbyPage';
import EditarStandbyPage from './pages/EditarStandbyPage';
import PrivacidadPage from './pages/PrivacidadPage';
import TerminosPage from './pages/TerminosPage';

import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectToDashboard />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/actividades"
          element={
            <PrivateRoute>
              <ActividadesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/personas"
          element={
            <PrivateRoute>
              <PersonasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/registrar-persona"
          element={
            <RoleRoute allowedRoles={[1, 2]}>
              <RegistroPersonaPage />
            </RoleRoute>
          }
        />
        <Route
          path="/editar-personas"
          element={
            <RoleRoute allowedRoles={[1]}>
              <EditarPersonasPage />
            </RoleRoute>
          }
        />
        <Route
          path="/registrar-equipo"
          element={
            <RoleRoute allowedRoles={[1, 2]}>
              <RegistroEquipoPage />
            </RoleRoute>
          }
        />
        <Route
          path="/editar-equipos"
          element={
            <RoleRoute allowedRoles={[1]}>
              <EditarEquiposPage />
            </RoleRoute>
          }
        />
        <Route
          path="/registrar-fase"
          element={
            <RoleRoute allowedRoles={[1, 2]}>
              <RegistroFasePage />
            </RoleRoute>
          }
        />
        <Route
          path="/editar-fases"
          element={
            <RoleRoute allowedRoles={[1]}>
              <EditarFasesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/registrar-paralizacion"
          element={
            <RoleRoute allowedRoles={[1, 2]}>
              <RegistroParalizacionPage />
            </RoleRoute>
          }
        />
        <Route
          path="/editar-paralizaciones"
          element={
            <RoleRoute allowedRoles={[1]}>
              <EditarParalizacionesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/registrar-standby"
          element={
            <RoleRoute allowedRoles={[1, 2]}>
              <RegistroStandbyPage />
            </RoleRoute>
          }
        />
        <Route
          path="/editar-standby"
          element={
            <RoleRoute allowedRoles={[1]}>
              <EditarStandbyPage />
            </RoleRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <ReportesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/privacidad" element={<PrivacidadPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
      </Routes>
    </Router>
  );
}

export default App;
