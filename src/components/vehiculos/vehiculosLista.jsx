import React, { useEffect, useMemo, useState } from "react";
import EquiposService from "../../services/EquiposServices";

export default function InventarioVehiculos() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await EquiposService.obtenerEquipos();
        const lista = Array.isArray(res.data) ? res.data : res.data?.$values ?? [];
        setEquipos(lista.filter((e) => e.categoria === "Vehículos"));
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return equipos;
    return equipos.filter((equipo) =>
      [equipo.codificacion, equipo.marca, equipo.modelo, equipo.placa, equipo.vin, equipo.ubicacion]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [equipos, busqueda]);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Inventario de vehículos</h1>
            <p className="text-sm text-slate-600">Control técnico, placa y ubicación del parque automotor.</p>
          </div>
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por codificación o placa" className="w-full md:w-80 rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Codificación</th>
              <th className="px-4 py-3">Familia</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Placa</th>
              <th className="px-4 py-3">VIN</th>
              <th className="px-4 py-3">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Cargando...</td></tr>
            ) : filtrados.length > 0 ? (
              filtrados.map((equipo, index) => (
                <tr key={equipo.id ?? index} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{equipo.codificacion || "-"}</td>
                  <td className="px-4 py-3">{equipo.familia || "-"}</td>
                  <td className="px-4 py-3">{equipo.marca || "-"}</td>
                  <td className="px-4 py-3">{equipo.modelo || "-"}</td>
                  <td className="px-4 py-3">{equipo.placa || "-"}</td>
                  <td className="px-4 py-3">{equipo.vin || "-"}</td>
                  <td className="px-4 py-3">{equipo.ubicacion || "-"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No se encontraron registros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
