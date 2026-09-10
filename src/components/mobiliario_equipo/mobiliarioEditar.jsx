import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EquiposServices from "../../services/EquiposServices";
import UbicacionesService from "../../services/UbicacionesServices";

const familias = [
  "Mobiliario administrativo",
  "Equipo no informático",
  "Otro mobiliario",
];

export default function EditarMobiliarioEquipo() {
  const [codificacion, setCodificacion] = useState("");
  const [equipo, setEquipo] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const res = await UbicacionesService.obtenerTodas();
        const data = Array.isArray(res.data) ? res.data : res.data?.$values ?? [];
        setUbicaciones(data);
      } catch (error) {
        console.error("Error cargando ubicaciones:", error);
      }
    };

    cargarUbicaciones();
  }, []);

  const buscarEquipo = async () => {
    const cod = codificacion.trim();
    if (!cod) {
      toast.warn("Ingrese una codificación");
      return;
    }

    try {
      setLoading(true);
      const { data } = await EquiposServices.obtenerPorCodificacion(cod);
      if (data.categoria !== "Mobiliario y equipo") {
        toast.error("Este activo no pertenece a mobiliario y equipo");
        setEquipo(null);
        return;
      }
      setEquipo(data);
    } catch (error) {
      console.error(error);
      toast.error("Activo no encontrado");
      setEquipo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipo((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    if (!equipo?.id) return;

    try {
      setSaving(true);
      await EquiposServices.editar(equipo.id, equipo);
      toast.success("Activo actualizado correctamente");
      setEquipo(null);
      setCodificacion("");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el activo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">Editar mobiliario o equipo</h1>
          <p className="mt-1 text-sm text-slate-600">Busca por codificación y actualiza la información.</p>
        </div>

        {!equipo ? (
          <div className="p-6">
            <label className="text-xs font-semibold text-slate-700">Codificación</label>
            <div className="mt-2 flex gap-3">
              <input value={codificacion} onChange={(e) => setCodificacion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && buscarEquipo()} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Ej: MOB-001" />
              <button onClick={buscarEquipo} disabled={loading} className="rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Buscando..." : "Buscar"}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Categoría</label>
                <input value={equipo.categoria} readOnly className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Familia</label>
                <select name="familia" value={equipo.familia || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
                  <option value="">Seleccione familia</option>
                  {familias.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Codificación</label><input value={equipo.codificacion || ""} readOnly className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Marca</label><input name="marca" value={equipo.marca || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Modelo</label><input name="modelo" value={equipo.modelo || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Serie</label><input name="serie" value={equipo.serie || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Orden de compra</label><input name="ordenCompra" value={equipo.ordenCompra || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Factura</label><input name="factura" value={equipo.factura || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Proveedor</label><input name="proveedor" value={equipo.proveedor || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Fecha ingreso</label><input type="date" name="fechaIngreso" value={equipo.fechaIngreso ? String(equipo.fechaIngreso).slice(0,10) : ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Estado</label><select name="estado" value={equipo.estado || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">Seleccione estado</option><option value="Buen estado">Buen estado</option><option value="En reparación">En reparación</option><option value="Obsoleto">Obsoleto</option><option value="Disponible">Disponible</option></select></div>
              <div className="flex flex-col"><label className="text-xs font-semibold text-slate-700">Ubicación</label><select name="ubicacion" value={equipo.ubicacion || ""} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="">Seleccione ubicación</option>{ubicaciones.map((u) => <option key={u.id ?? u.nombre} value={u.nombre}>{u.nombre}</option>)}</select></div>
              <div className="flex flex-col md:col-span-2"><label className="text-xs font-semibold text-slate-700">Comentarios</label><textarea name="comentarios" value={equipo.comentarios || ""} onChange={handleChange} rows="3" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /></div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEquipo(null)} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">Cancelar</button>
              <button type="button" onClick={guardarCambios} disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar cambios"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
