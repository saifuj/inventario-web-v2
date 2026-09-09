import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UbicacionesService from "../../services/UbicacionesServices";
import EquiposService from "../../services/EquiposServices";
import { obtenerCategoria } from "./catalogoActivos";

const CrearEquipo = () => {
  const [form, setForm] = useState({
    categoria: "",
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

  const categoriaSeleccionada = obtenerCategoria(form.categoria);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoriaInicial = params.get("categoria");
    const categoriaRuta = window.location.pathname
      .split("/")
      .filter(Boolean)
      .includes("inmuebles") ? "Inmuebles"
      : window.location.pathname.includes("mobiliario-y-equipo") ? "Mobiliario y equipo"
      : window.location.pathname.includes("equipo-de-computo") ? "Equipo de cómputo"
      : window.location.pathname.includes("vehiculos") ? "Vehículos"
      : window.location.pathname.includes("otros-activos") ? "Otros activos"
      : "";

    const categoriaFinal = categoriaInicial || categoriaRuta || "";
    if (categoriaFinal) setForm((prev) => ({ ...prev, categoria: categoriaFinal }));

    const cargarUbicaciones = async () => {
      try {
        const res = await UbicacionesService.obtenerTodas();
        let lista = [];

        if (Array.isArray(res.data)) lista = res.data;
        else if (Array.isArray(res.data?.$values)) lista = res.data.$values;

        setUbicaciones((lista || []).map((u) => u.nombre));
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

    const camposObligatorios = ["categoria", "familia", "fechaIngreso", "codificacion", "marca", "modelo", "estado", "ubicacion"];

    for (const campo of camposObligatorios) {
      if (!form[campo]) {
        toast.warn(`El campo "${campo}" es obligatorio.`);
        return;
      }
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    try {
      setSaving(true);
      await EquiposService.crear(formData);
      toast.success("Activo creado exitosamente");
      navigate("/equipos/inventario");
    } catch (error) {
      console.error("Error al crear el equipo:", error);

      if (error.response) {
        const data = error.response.data;
        if (data.errors) {
          const mensajes = Object.values(data.errors).flat().join("\n");
          toast.error(mensajes);
        } else if (data.title) toast.error(data.title);
        else if (typeof data === "string") toast.error(data);
        else toast.error("Error desconocido del servidor.");
      } else {
        toast.error("No se pudo conectar con el servidor.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">Crear activo</h1>
          <p className="mt-1 text-sm text-slate-600">Completa solo los datos necesarios para registrar el activo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="categoria" className="text-xs font-semibold text-slate-700">
                Categoría <span className="text-red-600">*</span>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="">-- Seleccione categoría --</option>
                <option value="Inmuebles">Inmuebles</option>
                <option value="Mobiliario y equipo">Mobiliario y equipo</option>
                <option value="Vehículos">Vehículos</option>
                <option value="Equipo de cómputo">Equipo de cómputo</option>
                <option value="Otros activos">Otros activos</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="familia" className="text-xs font-semibold text-slate-700">
                Familia <span className="text-red-600">*</span>
              </label>
              <select
                id="familia"
                name="familia"
                value={form.familia}
                onChange={handleChange}
                disabled={!categoriaSeleccionada}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800 disabled:bg-slate-100"
              >
                <option value="">-- Seleccione familia --</option>
                {categoriaSeleccionada?.familias.map((familia) => (
                  <option key={familia} value={familia}>
                    {familia}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="descripcionBien" className="text-xs font-semibold text-slate-700">
                Descripción del bien
              </label>
              <input
                id="descripcionBien"
                name="descripcionBien"
                value={form.descripcionBien}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Descripción breve"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="ordenCompra" className="text-xs font-semibold text-slate-700">Orden de compra</label>
              <input
                id="ordenCompra"
                name="ordenCompra"
                value={form.ordenCompra}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Orden de compra"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="factura" className="text-xs font-semibold text-slate-700">Factura</label>
              <input
                id="factura"
                name="factura"
                value={form.factura}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Número de factura"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="proveedor" className="text-xs font-semibold text-slate-700">Proveedor</label>
              <input
                id="proveedor"
                name="proveedor"
                value={form.proveedor}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Proveedor"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="fechaIngreso" className="text-xs font-semibold text-slate-700">
                Fecha de ingreso <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="fechaIngreso"
                name="fechaIngreso"
                value={form.fechaIngreso}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="codificacion" className="text-xs font-semibold text-slate-700">
                Codificación <span className="text-red-600">*</span>
              </label>
              <input
                id="codificacion"
                name="codificacion"
                value={form.codificacion}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Codificación"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="marca" className="text-xs font-semibold text-slate-700">
                Marca <span className="text-red-600">*</span>
              </label>
              <input
                id="marca"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Marca"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="modelo" className="text-xs font-semibold text-slate-700">
                Modelo <span className="text-red-600">*</span>
              </label>
              <input
                id="modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Modelo"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="serie" className="text-xs font-semibold text-slate-700">Serie</label>
              <input
                id="serie"
                name="serie"
                value={form.serie}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Serie"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="estado" className="text-xs font-semibold text-slate-700">
                Estado <span className="text-red-600">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="">-- Seleccione estado --</option>
                <option value="Buen estado">Buen estado</option>
                <option value="En reparación">En reparación</option>
                <option value="Obsoleto">Obsoleto</option>
                <option value="Disponible">Disponible</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="ubicacion" className="text-xs font-semibold text-slate-700">
                Ubicación <span className="text-red-600">*</span>
              </label>
              <input
                list="ubicaciones-list"
                id="ubicacion"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Ubicación"
              />
              <datalist id="ubicaciones-list">
                {ubicaciones.map((u, i) => (
                  <option key={i} value={u} />
                ))}
              </datalist>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="comentarios" className="text-xs font-semibold text-slate-700">Comentarios</label>
              <textarea
                id="comentarios"
                name="comentarios"
                value={form.comentarios}
                onChange={handleChange}
                rows="3"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Comentarios adicionales"
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
              {saving ? "Guardando..." : "Crear activo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEquipo;