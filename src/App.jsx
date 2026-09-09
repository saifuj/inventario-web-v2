import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useIsAuthenticated } from "@azure/msal-react";
import Inicio from "./pages/Inicio";
import Layout from "./components/Layout";
import Login from "./components/Login";

import {
  CrearEquipo,
  ListaEquipos,
  EditarEquipo,
  EliminarEquipos,
} from "./modules/activos";
import {
  CrearSolicitud,
  ListaSolicitud,
  EliminarSolicitud,
} from "./modules/solicitudes";
import {
  BajaActivosForm,
  ListabajaAtivos,
  generarBajaPDF,
  HojaResponsabilidad,
  ListaHojasResponsabilidad,
  HojaResponsabilidadEdit,
  ListaHojaSolvencia,
  HojaSolvencia,
  CrearTraslado,
  TrasladosLista,
  CrearTrasladoRetorno,
  TrasladosRetornoLista,
} from "./modules/formatos";
import {
  Suministros,
  SuministrosInventario,
  Movimientos,
  EliminarSuministros,
} from "./modules/suministros";

function RequireAuth({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const tokenApp = localStorage.getItem("tokenApp");
  if (!isAuthenticated && !tokenApp) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Navigate to="/inicio" replace />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/inicio" element={<Inicio />} />
          {/* EQUIPOS */}
          <Route path="/equipos/crear" element={<CrearEquipo />} />
          <Route path="/equipos/inventario/:categoria" element={<ListaEquipos />} />
          <Route path="/equipos/inventario" element={<ListaEquipos />} />
          <Route path="/equipos/editar" element={<EditarEquipo />} />
          <Route path="/equipos/eliminar" element={<EliminarEquipos />} />
          {/* SOLICITUDES */}
          <Route path="/solicitudes/crear" element={<CrearSolicitud />} />
          <Route path="/solicitudes/lista" element={<ListaSolicitud />} />
          <Route path="/solicitudes/eliminar" element={<EliminarSolicitud />} />
          {/* FORMATOS/RESPONSABILIDAD */}
          <Route path="/formatos/hojaderesponsabilidad" element={<HojaResponsabilidad />} />
          <Route path="/formatos/listahojasresponsabilidad" element={<ListaHojasResponsabilidad />} />
          <Route path="/hojas-responsabilidad/editar/:id" element={<HojaResponsabilidadEdit /> }/>
          {/* FORMATOS/SOLVENCIAS */}
          <Route path="/formatos/listahojasSolvencias" element={<ListaHojaSolvencia />} />
          <Route path="/formatos/hojasSolvencias" element={<HojaSolvencia />} />
          {/* FORMATOS/BAJADEACTIVOS */}
          <Route path="/formatos/bajaAtivos" element={<BajaActivosForm />} />
          <Route path="/formatos/ListabajaAtivos" element={<ListabajaAtivos />} />
          <Route path="/formatos/BajaActivo/BajaActivoPDF" element={<generarBajaPDF />} />
          {/* FORMATOS/TRASLADOS */}
          <Route path="/formatos/traslados/lista" element={<TrasladosLista />} />
          <Route path="/formatos/traslados/crear" element={<CrearTraslado />} />
          {/* FORMATOS/TRASLADOSRETORNO */}
          <Route path="/formatos/trasladosRetorno/crear" element={<CrearTrasladoRetorno />} />
          <Route path="/formatos/trasladosRetorno/lista" element={<TrasladosRetornoLista />} />
          {/* SUMINISTROS */}
          <Route path="/suministros" element={<Suministros />} />
          <Route path="/suministros/inventario" element={<SuministrosInventario />} />
          <Route path="/suministros/movimientos" element={<Movimientos />} />
          <Route path="/suministros/eliminarMovimientos" element={<EliminarSuministros />} />
        </Route>
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
