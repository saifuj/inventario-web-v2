import apiClient from "./ApiClient";

export default {
  listar: (params = {}) => apiClient.get("/Suministros", { params }),

  obtenerTodos: (params = {}) => apiClient.get("/Suministros", { params }),

  obtenerPorId: (id) => apiClient.get(`/Suministros/${id}`),

  crear: (data) => apiClient.post("/Suministros", data),

  actualizar: (id, data) => apiClient.put(`/Suministros/${id}`, data),

  eliminar: (id) => apiClient.delete(`/Suministros/${id}`),

  eliminarTodos: () => apiClient.delete("/Suministros/todos"),

  obtenerConTotales: () => apiClient.get("/Suministros/con-totales"),

  recalcularInventario: (suministroId) =>
    apiClient.post(`/Suministros/${suministroId}/recalcular`),

  importarExcel: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/Suministros/importar-excel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  exportarExcel: () =>
    apiClient.get("/Suministros/exportar-excel", {
      responseType: "blob",
    }),

  obtenerEntradas: () => apiClient.get("/EntradaSuministro"),
  obtenerEntradaPorId: (id) => apiClient.get(`/EntradaSuministro/${id}`),
  registrarEntrada: (dto) => apiClient.post("/EntradaSuministro", dto),
  eliminarEntrada: (id) => apiClient.delete(`/EntradaSuministro/${id}`),

  obtenerSalidas: () => apiClient.get("/SalidasSuministros"),
  obtenerSalidaPorId: (id) => apiClient.get(`/SalidasSuministros/${id}`),
  registrarSalida: (dto) => apiClient.post("/SalidasSuministros", dto),
  eliminarSalida: (id) => apiClient.delete(`/SalidasSuministros/${id}`),
};
