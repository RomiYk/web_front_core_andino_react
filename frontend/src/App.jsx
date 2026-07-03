import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Mora from "./pages/Mora";
import Calculadora from "./pages/Calculadora";
import Core from "./pages/Core";
import AccesoDenegado from "./pages/AccesoDenegado";

// Ruta protegida: si no hay token, redirige al home
function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

// Ruta pública: si ya hay sesión, redirige al dashboard
function RutaPublica({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Ruta restringida por rol — solo el personal autorizado puede entrar
// (Panel Core y Bandeja de Mora NO son para clientes)
function RutaPorRol({ children, rolesPermitidos }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch (_) {}

  const rol = usuario?.rol || "cliente";
  if (!rolesPermitidos.includes(rol)) {
    return <AccesoDenegado />;
  }
  return children;
}

const ROLES_STAFF = ["asesor", "comite", "admin", "gerencia", "riesgos"];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <RutaPublica>
            <Home />
          </RutaPublica>
        } />
        <Route path="/dashboard" element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } />
        <Route path="/mora" element={
          <RutaPorRol rolesPermitidos={ROLES_STAFF}>
            <Mora />
          </RutaPorRol>
        } />
        <Route path="/calculadora" element={
          <RutaProtegida>
            <Calculadora />
          </RutaProtegida>
        } />
        <Route path="/core" element={
          <RutaPorRol rolesPermitidos={ROLES_STAFF}>
            <Core />
          </RutaPorRol>
        } />
        {/* Cualquier ruta no encontrada va al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
