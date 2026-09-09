import React, { useEffect, useMemo, useState } from "react";
import EquiposService from "../../services/EquiposServices";
import { exportarExcel } from "../../services/ExportExcel";
import { CATEGORIAS_ACTIVOS } from "./catalogoActivos";

const camposFiltro = [
  { label: "Categoría", value: "categoria", tipo: "select", opciones: CATEGORIAS_ACTIVOS.map(({ label }) => label) },
  { label: "Familia", value: "familia", tipo: "texto" },
  { label: "Codificación", value: "codificacion", tipo: "texto" },
  { label: "Factura", value: "factura", tipo: "texto" },
  { label: "Marca", value: "marca", tipo: "texto" },
  { label: "Proveedor", value: "proveedor", tipo: "texto" },
  { label: "Modelo", value: "modelo", tipo: "texto" },
  { label: "Estado", value: "estado", tipo: "select", opciones: ["Buen estado", "Inactivo", "Obsoleto"] },
  { label: "Ubicación", value: "ubicacion", tipo: "texto" },
  { label: "Asignado a", value: "asignadoA", tipo: "texto" },
  { label: "No. de Registro Deprect", value: "noRegistroDeprect", tipo: "texto" },
  { label: "Orden de Compra", value: "ordenCompra", tipo: "texto" },
  { label: "Fecha Ingreso", value: "fechaIngreso", tipo: "fecha" },
  { label: "Hoja No.", value: "hojaNo", tipo: "texto" },
  { label: "Fecha Actualizacion", value: "fechaActualizacion", tipo: "fecha" },
  { label: "Equipo", value: "equipo", tipo: "texto" },
  { label: "Serie", value: "serie", tipo: "texto" },
  { label: "IMEI", value: "imei", tipo: "texto" },
  { label: "Tipo", value: "tipo", tipo: "texto" },
  { label: "Responsable Anterior", value: "responsableAnterior", tipo: "texto" },
  { label: "Número asignado", value: "numeroAsignado", tipo: "texto" },
  { label: "Extensión", value: "extension", tipo: "texto" },
  { label: "Revisado de toma fisica", value: "revisadoTomaFisica", tipo: "texto" },
  { label: "Fecha de toma", value: "fechaToma", tipo: "fecha" },
  { label: "Estado de Sticker", value: "estadoSticker", tipo: "select", opciones: ["Buen estado", "Cambio"] },
  { label: "Asignado a Hoja de responsabilidad", value: "asignadoHojaResponsabilidad", tipo: "texto" },
  { label: "Comentarios", value: "comentarios", tipo: "texto" },
  { label: "Observaciones", value: "observaciones", tipo: "texto" },
];

const columnasGenericas = [
  { key: "index", label: "#", ancho: "80" },
  { key: "ordenCompra", label: "Orden de Compra", ancho: "160" },
  { key: "factura", label: "Factura", ancho: "160" },
  { key: "proveedor", label: "Proveedor", ancho: "180" },
  { key: "fechaIngreso", label: "Fecha Ingreso", ancho: "140" },
  { key: "hojaNo", label: "Hoja No.", ancho: "100" },
  { key: "fechaActualizacion", label: "Fecha Actualizacion", ancho: "140" },
  { key: "asignaciones", label: "Asignado a", ancho: "220" },
  { key: "codificacion", label: "Codificación", ancho: "180" },
  { key: "categoria", label: "Categoría", ancho: "160" },
  { key: "familia", label: "Familia", ancho: "180" },
  { key: "estado", label: "Estado", ancho: "140" },
  { key: "tipoEquipo", label: "Equipo", ancho: "140" },
  { key: "marca", label: "Marca", ancho: "140" },
  { key: "modelo", label: "Modelo", ancho: "140" },
  { key: "serie", label: "Serie", ancho: "160" },
  { key: "responsableAnterior", label: "Responsable Anterior", ancho: "180" },
  { key: "extension", label: "Extensión", ancho: "120" },
  { key: "ubicacion", label: "Ubicación", ancho: "180" },
  { key: "comentarios", label: "Comentarios", ancho: "220" },
  { key: "observaciones", label: "Observaciones", ancho: "220" },
];

const normalizarCategoria = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const columnasPorCategoria = {
  inmuebles: [
    { key: "index", label: "#", ancho: "80" },
    { key: "ordenCompra", label: "No. De Orden de compra", ancho: "180" },
    { key: "fechaOrdenCompra", label: "Fecha de la Orden de compra", ancho: "180" },
    { key: "factura", label: "No. Factura electrónica", ancho: "180" },
    { key: "proveedor", label: "Nombre de Proveedor", ancho: "200" },
    { key: "fechaFactura", label: "Fecha factura", ancho: "140" },
    { key: "descripcionBien", label: "Descripción del bien", ancho: "220" },
    { key: "estado", label: "Estado", ancho: "180" },
    { key: "direccion", label: "Dirección", ancho: "220" },
    { key: "fichaTecnica", label: "Ficha técnica", ancho: "220" },
    { key: "multimedia", label: "Apartado multimedia", ancho: "220" },
    { key: "polizaSeguro", label: "Pólizas de seguro", ancho: "220" },
    { key: "catalogoActivos", label: "Catálogo de activos", ancho: "200" },
  ],
  "mobiliario y equipo": [
    { key: "index", label: "#", ancho: "80" },
    { key: "ordenCompra", label: "Orden de Compra", ancho: "160" },
    { key: "factura", label: "Factura", ancho: "160" },
    { key: "proveedor", label: "Proveedor", ancho: "180" },
    { key: "fechaIngreso", label: "Fecha Ingreso", ancho: "140" },
    { key: "hojaNo", label: "Hoja No.", ancho: "100" },
    { key: "fechaActualizacion", label: "Fecha Actualizacion", ancho: "140" },
    { key: "asignaciones", label: "Asignado a", ancho: "220" },
    { key: "codificacion", label: "Codificación", ancho: "180" },
    { key: "categoria", label: "Categoría", ancho: "160" },
    { key: "familia", label: "Familia", ancho: "180" },
    { key: "estado", label: "Estado", ancho: "140" },
    { key: "tipoEquipo", label: "Equipo", ancho: "140" },
    { key: "marca", label: "Marca", ancho: "140" },
    { key: "modelo", label: "Modelo", ancho: "140" },
    { key: "numeroChapa", label: "Número de chapa del activo", ancho: "180" },
    { key: "controlLlaves", label: "Control de llaves", ancho: "160" },
    { key: "estadoFisico", label: "Estado físico actual", ancho: "180" },
    { key: "color", label: "Color", ancho: "140" },
    { key: "dimensiones", label: "Dimensiones", ancho: "160" },
    { key: "catalogoActivos", label: "Catálogo de activos", ancho: "180" },
    { key: "reporteDanios", label: "Reporte de daños o incidencias", ancho: "220" },
    { key: "ubicacion", label: "Ubicación", ancho: "180" },
    { key: "comentarios", label: "Comentarios", ancho: "220" },
    { key: "observaciones", label: "Observaciones", ancho: "220" },
  ],
  "equipo de computo": [
    { key: "index", label: "#", ancho: "80" },
    { key: "ordenCompra", label: "Orden de Compra", ancho: "160" },
    { key: "factura", label: "Factura", ancho: "160" },
    { key: "proveedor", label: "Proveedor", ancho: "180" },
    { key: "fechaIngreso", label: "Fecha Ingreso", ancho: "140" },
    { key: "hojaNo", label: "Hoja No.", ancho: "100" },
    { key: "fechaActualizacion", label: "Fecha Actualizacion", ancho: "140" },
    { key: "asignaciones", label: "Asignado a", ancho: "220" },
    { key: "codificacion", label: "Codificación", ancho: "180" },
    { key: "categoria", label: "Categoría", ancho: "160" },
    { key: "familia", label: "Familia", ancho: "180" },
    { key: "estado", label: "Estado", ancho: "140" },
    { key: "tipoEquipo", label: "Equipo", ancho: "140" },
    { key: "marca", label: "Marca", ancho: "140" },
    { key: "modelo", label: "Modelo", ancho: "140" },
    { key: "serie", label: "Serie", ancho: "160" },
    { key: "catalogoActivos", label: "Catálogo de activos", ancho: "180" },
    { key: "reporteDanios", label: "Reporte de daños o incidencias", ancho: "220" },
    { key: "ubicacion", label: "Ubicación", ancho: "180" },
    { key: "comentarios", label: "Comentarios", ancho: "220" },
    { key: "observaciones", label: "Observaciones", ancho: "220" },
  ],
  vehiculos: [
    { key: "index", label: "#", ancho: "80" },
    { key: "ordenCompra", label: "Orden de Compra", ancho: "160" },
    { key: "factura", label: "Factura", ancho: "160" },
    { key: "proveedor", label: "Proveedor", ancho: "180" },
    { key: "fechaIngreso", label: "Fecha Ingreso", ancho: "140" },
    { key: "hojaNo", label: "Hoja No.", ancho: "100" },
    { key: "fechaActualizacion", label: "Fecha Actualizacion", ancho: "140" },
    { key: "asignaciones", label: "Asignado a", ancho: "220" },
    { key: "codificacion", label: "Codificación", ancho: "180" },
    { key: "categoria", label: "Categoría", ancho: "160" },
    { key: "familia", label: "Familia", ancho: "180" },
    { key: "estado", label: "Estado", ancho: "140" },
    { key: "tipoEquipo", label: "Equipo", ancho: "140" },
    { key: "marca", label: "Marca", ancho: "140" },
    { key: "modelo", label: "Modelo", ancho: "140" },
    { key: "placa", label: "Placa", ancho: "140" },
    { key: "vin", label: "VIN / número de chasis", ancho: "180" },
    { key: "numeroChasis", label: "Número de chasis", ancho: "180" },
    { key: "modeloAnio", label: "Año / modelo", ancho: "140" },
    { key: "colorVehiculo", label: "Color", ancho: "140" },
    { key: "tipoCombustible", label: "Tipo de combustible", ancho: "170" },
    { key: "kilometraje", label: "Kilometraje", ancho: "140" },
    { key: "estadoFisico", label: "Estado físico", ancho: "160" },
    { key: "catalogoVehiculo", label: "Catálogo", ancho: "150" },
    { key: "polizaSeguro", label: "Póliza de seguro", ancho: "180" },
    { key: "programacionMantenimiento", label: "Programación de mantenimiento", ancho: "220" },
    { key: "alertasServicio", label: "Alertas de servicios", ancho: "220" },
    { key: "historialReparaciones", label: "Historial de reparaciones", ancho: "220" },
    { key: "reporteDanios", label: "Reporte de daños / incidencias", ancho: "220" },
    { key: "bitacoraFallas", label: "Bitácora de fallas", ancho: "220" },
    { key: "ubicacion", label: "Ubicación", ancho: "180" },
    { key: "comentarios", label: "Comentarios", ancho: "220" },
    { key: "observaciones", label: "Observaciones", ancho: "220" },
  ],
};

const obtenerColumnasInventario = (categoria) => {
  if (!categoria) return columnasGenericas;
  const categoriaKey = normalizarCategoria(categoria);
  return columnasPorCategoria[categoriaKey] || columnasGenericas;
};

const renderizarValorCelda = (equipo, key) => {
  if (key === "index") return "-";

  if (key === "asignaciones") {
    return equipo.asignaciones?.length > 0 ? (
      equipo.asignaciones.map((a, i) => (
        <div key={i} className="mb-1">
          <span className="text-blue-700 font-semibold">{a.codigoEmpleado}</span>{" "}
          - {a.nombreEmpleado}
          <div className="text-gray-500 italic text-[11px]">{a.puesto}</div>
        </div>
      ))
    ) : (
      <span className="text-gray-400 italic">Sin asignaciones</span>
    );
  }

  if (["fechaIngreso", "fechaActualizacion", "fechaOrdenCompra", "fechaFactura"].includes(key)) {
    const fecha = equipo[key];
    return fecha ? new Date(fecha).toLocaleDateString("es-ES") : "Sin fecha";
  }

  if (key === "multimedia") {
    return equipo.multimedia || "-";
  }

  if (key === "polizaSeguro") {
    return equipo.polizaSeguro || "-";
  }

  if (key === "catalogoActivos") {
    return equipo.catalogoActivos || equipo.catalogoActivo || equipo.catalogo || "-";
  }

  if (key === "reporteDanios") {
    return equipo.reporteDanios || equipo.reporteDeDanios || equipo.reportes || "-";
  }

  if (key === "modeloAnio") {
    return equipo.modeloAnio || "-";
  }

  if (key === "estadoFisico") {
    return equipo.estadoFisico || equipo.estado || "-";
  }

  if (key === "ubicacion") {
    return equipo.ubicacion || "-";
  }

  const valor = equipo[key];
  if (valor === null || valor === undefined || valor === "") return "-";
  return String(valor);
};

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState([]);
  const [agruparFamilia, setAgruparFamilia] = useState(true);
  const categoriaUrl = new URLSearchParams(window.location.search).get("categoria") || "";

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        setLoading(true);
        const res = await EquiposService.obtenerEquipos();
        let lista = [];

        if (Array.isArray(res.data)) lista = res.data;
        else if (Array.isArray(res.data?.$values)) lista = res.data.$values;

        setEquipos(lista);
      } catch (err) {
        console.error("Error al obtener equipos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarEquipos();
  }, []);

  const agregarFiltro = () => {
    setFiltros((prev) => [...prev, { campo: camposFiltro[0].value, valor: "" }]);
  };

  const cambiarCampoFiltro = (index, campoNuevo) => {
    setFiltros((prev) =>
      prev.map((filtro, i) => (i === index ? { campo: campoNuevo, valor: "" } : filtro))
    );
  };

  const cambiarValorFiltro = (index, valorNuevo) => {
    setFiltros((prev) =>
      prev.map((filtro, i) => (i === index ? { ...filtro, valor: valorNuevo } : filtro))
    );
  };

  const eliminarFiltro = (index) => {
    setFiltros((prev) => prev.filter((_, i) => i !== index));
  };

  const resultadosFiltrados = useMemo(() => {
    const equiposPorCategoria = categoriaUrl
      ? equipos.filter((equipo) => normalizarCategoria(equipo.categoria) === normalizarCategoria(categoriaUrl))
      : equipos;
    if (filtros.length === 0) return equiposPorCategoria;

    return equiposPorCategoria.filter((equipo) =>
      filtros.every(({ campo, valor }) => {
        if (!valor?.toString().trim()) return true;

        let valorCampo = "";

        if (campo === "asignaciones") {
          valorCampo =
            equipo.asignaciones
              ?.map((a) => `${a.codigoEmpleado || ""} ${a.nombreEmpleado || ""} ${a.puesto || ""}`)
              .join(" ")
              .toLowerCase() || "";
        } else {
          valorCampo =
            equipo?.[campo] !== null && equipo?.[campo] !== undefined
              ? equipo[campo].toString().toLowerCase()
              : "";
        }

        return valorCampo.includes(valor.toLowerCase());
      })
    );
  }, [categoriaUrl, equipos, filtros]);

  const limpiarFiltros = () => setFiltros([]);

  const equiposVisibles = useMemo(() => {
    if (!agruparFamilia) return resultadosFiltrados;
    return [...resultadosFiltrados].sort((a, b) =>
      `${a.categoria || "Sin categoría"}-${a.familia || "Sin familia"}`.localeCompare(
        `${b.categoria || "Sin categoría"}-${b.familia || "Sin familia"}`,
        "es"
      )
    );
  }, [agruparFamilia, resultadosFiltrados]);

  const exportar = () => {
    exportarExcel(resultadosFiltrados, "Equipos_Filtrados");
  };

  const columnasVisibles = obtenerColumnasInventario(categoriaUrl);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Inventario de activos</h1>
              <p className="text-sm text-slate-500">
                {categoriaUrl ? `Apartado: ${categoriaUrl}` : "Clasificación, familias, control físico y exportación."}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
                Total: {equipos.length}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-700">
                Mostrando: {equiposVisibles.length}
              </span>
              <button
                onClick={exportar}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                Exportar Excel
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 items-end">
            {filtros.map((filtro, i) => {
              const campoInfo = camposFiltro.find((c) => c.value === filtro.campo);

              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <select
                    value={filtro.campo}
                    onChange={(e) => cambiarCampoFiltro(i, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {camposFiltro.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {campoInfo?.tipo === "select" ? (
                    <select
                      value={filtro.valor}
                      onChange={(e) => cambiarValorFiltro(i, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">-- Todos --</option>
                      {campoInfo.opciones.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={campoInfo?.tipo === "fecha" ? "date" : "text"}
                      placeholder={`Buscar ${campoInfo?.label || ""}`}
                      value={filtro.valor}
                      onChange={(e) => cambiarValorFiltro(i, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  )}

                  <button
                    onClick={() => eliminarFiltro(i)}
                    className="text-red-600 hover:text-red-800 font-bold px-2"
                    title="Eliminar filtro"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            <button
              onClick={agregarFiltro}
              className="rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-blue-700 transition"
            >
              + Añadir filtro
            </button>

            <button
              onClick={limpiarFiltros}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Limpiar filtros
            </button>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 px-2 py-2.5">
              <input type="checkbox" checked={agruparFamilia} onChange={(e) => setAgruparFamilia(e.target.checked)} className="h-4 w-4 accent-blue-700" />
              Agrupar por familia
            </label>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-6">
          <div className="h-full rounded-2xl border border-slate-200 overflow-auto">
            <table className="min-w-[2200px] w-full text-xs border border-gray-300 border-collapse">
              <thead className="sticky top-0 z-10">
                {categoriaUrl ? (
                  <tr className="text-center text-white font-semibold">
                    {columnasVisibles.map((columna) => (
                      <th
                        key={columna.key}
                        className="px-3 py-2 border bg-blue-700 min-w-[120px]"
                        style={{ minWidth: `${Math.max(Number(columna.ancho) || 120, 100)}px` }}
                      >
                        {columna.label}
                      </th>
                    ))}
                  </tr>
                ) : (
                  <>
                    <tr className="text-center font-bold text-white">
                      <th colSpan="5" className="px-3 py-2 border bg-blue-700">
                        DATOS GENERALES
                      </th>
                      <th colSpan="3" className="px-3 py-2 border bg-blue-800">
                        DATOS DE USUARIO
                      </th>
                      <th colSpan="10" className="px-3 py-2 border bg-blue-900">
                        DATOS DEL EQUIPO
                      </th>
                      <th colSpan="1" className="px-3 py-2 border bg-blue-600">
                        UBICACION DEL EQUIPO
                      </th>
                      <th colSpan="2" className="px-3 py-2 border bg-blue-800">
                        INFORMACION DE EQUIPO
                      </th>
                    </tr>

                    <tr className="text-center text-white font-semibold">
                      {columnasGenericas.map((columna) => (
                        <th
                          key={columna.key}
                          className="px-3 py-2 border bg-blue-700 min-w-[120px]"
                          style={{ minWidth: `${Math.max(Number(columna.ancho) || 120, 100)}px` }}
                        >
                          {columna.label}
                        </th>
                      ))}
                    </tr>
                  </>
                )}
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columnasVisibles.length || 1} className="text-center p-6 text-gray-500">
                      Cargando equipos...
                    </td>
                  </tr>
                ) : equiposVisibles.length > 0 ? (
                  equiposVisibles.map((equipo, index) => (
                    <React.Fragment key={equipo.id ?? index}>
                      {agruparFamilia && !categoriaUrl && (index === 0 || equiposVisibles[index - 1].familia !== equipo.familia || equiposVisibles[index - 1].categoria !== equipo.categoria) && (
                        <tr className="bg-slate-100 text-left"><td colSpan={columnasGenericas.length} className="px-3 py-2 border font-bold text-slate-700">{equipo.categoria || "Sin categoría"} / {equipo.familia || "Sin familia"}</td></tr>
                      )}

                      <tr className="text-center even:bg-gray-50 hover:bg-blue-50">
                        {columnasVisibles.map((columna) => (
                          <td
                            key={`${equipo.id ?? index}-${columna.key}`}
                            className={`px-3 py-2 border ${columna.key === "asignaciones" || columna.key === "comentarios" || columna.key === "observaciones" || columna.key === "descripcionBien" || columna.key === "direccion" || columna.key === "fichaTecnica" || columna.key === "multimedia" || columna.key === "programacionMantenimiento" || columna.key === "alertasServicio" || columna.key === "historialReparaciones" || columna.key === "reporteDanios" || columna.key === "bitacoraFallas" ? "break-words text-left" : ""} ${columna.key === "hojaNo" ? "text-red-600 font-semibold" : ""}`}
                            style={{ minWidth: `${Math.max(Number(columna.ancho) || 120, 100)}px` }}
                          >
                            {columna.key === "index" ? index + 1 : renderizarValorCelda(equipo, columna.key)}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columnasVisibles.length || 1} className="text-center p-6 text-gray-500">
                      No se encontraron equipos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Tip: podés agregar múltiples filtros para afinar resultados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaEquipos;