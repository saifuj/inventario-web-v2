import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ListaEquipos from "../equipos/ListaEquipos";

export default function InventarioInmuebles() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("categoria")) {
      setSearchParams({ categoria: "Inmuebles" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return <ListaEquipos />;
}
