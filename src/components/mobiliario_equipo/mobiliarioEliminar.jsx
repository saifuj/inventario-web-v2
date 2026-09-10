import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EquiposService from "../../services/EquiposServices";

export default function EliminarMobiliarioEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await EquiposService.obtenerEquipos();
      const lista = Array.isArray(res.data) ? res.data : res.data?.$values ?? [];
      setEquipos(lista.filter((e) => e.categoria === "Mobiliario y equipo"));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar registros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!window.confirm("¿Desea eliminar este activo?")) return;
    try {
      setDeletingId(id);
      await EquiposService.eliminar(id);
      toast.success("Activo eliminado");
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Eliminar mobiliario y equipo</h1>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">Codificación</th>
              <th className="px-4 py-3">Familia</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Cargando...</td></tr>
            ) : equipos.length > 0 ? (
              equipos.map((equipo) => (
                <tr key={equipo.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold">{equipo.codificacion || "-"}</td>
                  <td className="px-4 py-3">{equipo.familia || "-"}</td>
                  <td className="px-4 py-3">{equipo.marca || "-"}</td>
                  <td className="px-4 py-3">{equipo.modelo || "-"}</td>
                  <td className="px-4 py-3">{equipo.ubicacion || "-"}</td>
                  <td className="px-4 py-3"><button onClick={() => eliminar(equipo.id)} disabled={deletingId === equipo.id} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{deletingId === equipo.id ? "Eliminando..." : "Eliminar"}</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No hay activos para eliminar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
