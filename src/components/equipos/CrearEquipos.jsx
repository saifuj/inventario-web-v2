import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UbicacionesService from "../../services/UbicacionesServices";
import EquiposService from "../../services/EquiposServices";
import { obtenerCategoria } from "./catalogoActivos";

const CrearEquipoComputo = () => {
  const CATEGORIA = "Equipo de cómputo";
  const catInfo = obtenerCategoria(CATEGORIA);

  const [form, setForm] = useState({
    categoria: CATEGORIA,
    familia: "",
    descripcionBien: "",
    ordenCompra: "",
    factura: "",
    proveedor: "",
    fechaIngreso: "",
    codificacion: "",
    marca: "",
    modelo: "",
    serie: "",
    estado: "",
    ubicacion: "",
    comentarios: "",
  });

  const [ubicaciones, setUbicaciones] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const res = await UbicacionesService.obtenerTodas();
        let lista = Array.isArray(res.data) ? res.data : res.data?.$values || [];
        setUbicaciones(lista.map((u) => u.nombre));
      } catch (error) {
        console.error("Error al cargar ubicaciones:", error);
      }
    };
    cargarUbicaciones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obligatorios = ["familia", "fechaIngreso", "codificacion", "marca", "modelo", "serie", "estado", "ubicacion"];
    for (const campo of obligatorios) {
      if (!form[campo]) {
        toast.warn(`El campo "${campo}" es obligatorio.`);
        return;
      }
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v ?? ""));

    try {
      setSaving(true);
      await EquiposService.crear(formData);
      toast.success("Equipo informático registrado exitosamente");
      navigate("/equipos/inventario");
    } catch (error) {
      toast.error(error.response?.data?.title || "Error al crear equipo informático");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8 overflow-y-auto">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">Crear Equipo de Cómputo</h1>
          <p className="mt-1 text-sm text-slate-600">Hardware informático, servidores y dispositivos periféricos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Tipo de Hardware (Familia) *</label>
              <select
                name="familia"
                value={form.familia}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="">-- Seleccione tipo --</option>
                {catInfo?.familias.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Marca *</label>
              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Ej. Dell, Lenovo, HP"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Modelo *</label>
              <input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ej. ThinkPad L14"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Número de Serie (S/N) *</label>
              <input
                name="serie"
                value={form.serie}
                onChange={handleChange}
                placeholder="Serie de fábrica"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Codificación / Asset Tag *</label>
              <input
                name="codificacion"
                value={form.codificacion}
                onChange={handleChange}
                placeholder="Etiqueta interna TI"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Ubicación / Usuario asignado *</label>
              <input
                list="ubicaciones-list"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
              <datalist id="ubicaciones-list">
                {ubicaciones.map((u, i) => <option key={i} value={u} />)}
              </datalist>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Estado *</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="">-- Seleccione estado --</option>
                <option value="Asignado">Asignado</option>
                <option value="Disponible">Disponible en Stock</option>
                <option value="En reparación">En reparación</option>
                <option value="Obsoleto">Obsoleto / Para baja</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Fecha de Ingreso *</label>
              <input
                type="date"
                name="fechaIngreso"
                value={form.fechaIngreso}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-700">Proveedor</label>
              <input
                name="proveedor"
                value={form.proveedor}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Especificaciones Técnicas (RAM, Disco, Procesador)</label>
              <textarea
                name="comentarios"
                rows="3"
                value={form.comentarios}
                onChange={handleChange}
                placeholder="Ej. i7 12th Gen, 16GB RAM, 512GB SSD"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/inicio")}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-950 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Crear equipo TI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEquipoComputo;