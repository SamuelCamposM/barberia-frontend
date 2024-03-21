import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export const DataAlerta = ({
  titulo,
  subtitulo,
  enlace = "",
}: {
  titulo: string;
  subtitulo: string;
  enlace?: string;
}) => {
  return (
    <Link to={enlace === "" ? "#" : enlace} style={{ textDecoration: "none" }}>
      <Typography variant="body1" color="primary">
        {titulo}
      </Typography>
      <Typography variant="body2" color="tertiary.main">
        {subtitulo}
      </Typography>
    </Link>
  );
};
