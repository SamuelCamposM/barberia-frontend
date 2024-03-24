import { ContentCut } from "@mui/icons-material";

import { Box, Typography } from "@mui/material";
import "./Cargando.css";
export const Cargando = ({ titulo = "Cargando" }: { titulo?: string }) => {
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Box sx={{ animation: "rotating 2s linear infinite" }}>
        <ContentCut sx={{ fontSize: "10rem" }} />
      </Box>
      <Typography
        marginTop={3}
        variant="h3"
        color="primary"
        width="100%"
        textAlign="center"
        textTransform="uppercase"
      >
        {titulo}
      </Typography>
    </Box>
  );
};
