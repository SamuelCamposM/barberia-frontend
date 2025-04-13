import { useMemo } from "react";
import { usePageStore } from "../Page";
import { StyledGridContainer } from "../../components/style";
import { Box } from "@mui/material";
import { ConvertirIcono, convertirPath } from "../../../helpers";
import { useNavigate } from "react-router-dom";
import { TableTitle } from "../../components";
import { InfoCard } from "../../components/Cards/InfoCard";

const columns = {
  lg: 4,
  md: 2,
  xs: 1,
};
export const Seccion = () => {
  const { getChildren, data } = usePageStore();
  const { children, padreFind } = useMemo(() => {
    return getChildren();
  }, [data, location.pathname]);

  const navigate = useNavigate();
  return (
    <StyledGridContainer {...columns}>
      <Box className="fullWidth">
        <TableTitle
          texto={`${padreFind?.nombre}: ${
            children.length === 0 ? "NO HAY MODULOS" : children.length
          } `}
        />
      </Box>

      {children.map((child) => (
        <InfoCard
          desc={ "SIN DESCRIPCIÓN"}
          titulo={child.nombre}
          Icono={ConvertirIcono(child.icono, "large")}
          onClick={() => {
            navigate(convertirPath(child.nombre));
          }}
          key={child._id}
        />
      ))}
    </StyledGridContainer>
  );
};

export default Seccion;
