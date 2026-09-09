export {
  default as CrearEquipo,
  default as ListaEquipos,
  default as EditarEquipo,
  default as EliminarEquipos,
  CATEGORIAS_ACTIVOS,
  obtenerCategoria,
} from "./inmuebles";

export {
  default as CrearInmueble,
  default as ListaInmuebles,
  default as EditarInmueble,
  default as EliminarInmuebles,
  IngresarInmueble,
  InventarioInmuebles,
} from "./inmuebles";

export {
  default as CrearMobiliarioEquipo,
  default as ListaMobiliarioEquipo,
  default as EditarMobiliarioEquipo,
  default as EliminarMobiliarioEquipo,
  IngresarMobiliarioEquipo,
  InventarioMobiliarioEquipo,
} from "./mobiliario-y-equipo";

export {
  default as CrearEquipoComputo,
  default as ListaEquipoComputo,
  default as EditarEquipoComputo,
  default as EliminarEquipoComputo,
  IngresarEquipoComputo,
  InventarioEquipoComputo,
} from "./equipo-de-computo";

export {
  default as CrearVehiculo,
  default as ListaVehiculos,
  default as EditarVehiculo,
  default as EliminarVehiculos,
  IngresarVehiculo,
  InventarioVehiculos,
  CATEGORIAS_ACTIVOS as CATEGORIAS_VEHICULOS,
  obtenerCategoria as obtenerCategoriaVehiculo,
} from "./vehiculos";

export {
  default as CrearOtrosActivos,
  default as ListaOtrosActivos,
  default as EditarOtrosActivos,
  default as EliminarOtrosActivos,
  IngresarOtrosActivos,
  InventarioOtrosActivos,
} from "./otros-activos";
