import { toast } from "react-toastify";
import { useAuthStore } from "../../hooks";
import { useMenuStore } from "../pages/Menu";
import { DataAlerta } from "../components";
import { tipoPermiso } from "../../interfaces/global";
import { Components } from "@mui/material";
export const usePermiso = (component: Components, tipoPermiso: tipoPermiso) => {
  const {
    user: { rol },
  } = useAuthStore();
  const { rows } = useMenuStore();
  const tienePermiso = () => {
    const pageFind = rows.find((page) => page.componente === component);
    if (!pageFind) {
      toast.error(<DataAlerta titulo={"Error al validar permiso"} />);
      return false;
    }
    const tienePermiso = pageFind[tipoPermiso].includes(rol);
    if (!tienePermiso) {
      toast.error(
        <DataAlerta titulo={`No tiene permiso para  ${tipoPermiso}`} />
      );
    }
    return tienePermiso;
  };
  return tienePermiso;
};
