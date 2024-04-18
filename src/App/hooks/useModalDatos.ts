import { useMemo } from "react";

interface ModalConfig {
  idModal: string;
  columns: { lg: number; md: number; xs: number };
  vhContainer: {
    height: { lg: string; md: string; xs: string };
    header_height: number;
    footer_height: number;
  };
  width: { lg: string; md: string; xs: string };
}

export const useModalConfig = (
  idModal: string,
  columns?: { lg: number; md: number; xs: number },
  vhContainer?: {
    height: { lg: string; md: string; xs: string };
    header_height: number;
    footer_height: number;
  },
  width?: { lg: string; md: string; xs: string }
): ModalConfig => {
  const defaultModalConfig: ModalConfig = {
    idModal: idModal,
    columns: columns || { lg: 2, md: 2, xs: 1 },
    vhContainer: vhContainer || {
      height: { lg: "50", md: "60", xs: "90" },
      header_height: 40,
      footer_height: 40,
    },
    width: width || {
      lg: "60",
      md: "70",
      xs: "100",
    },
  };

  return useMemo<ModalConfig>(() => defaultModalConfig, []);
};

// Ejemplo de uso:
// const modalConfig = useModalConfig("miModal", { lg: 3, md: 2, xs: 1 }, { height: { lg: "60", md: "70", xs: "100" } }, { lg: "80", md: "90", xs: "100" });
// Ahora puedes acceder a modalConfig.idModal, modalConfig.columns, etc. en tus componentes.
