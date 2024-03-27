import { FormEvent, useMemo } from "react";
import { useForm } from "../../../../hooks";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Cancel } from "@mui/icons-material";

export const Buscador = () => {
  const navigate = useNavigate();
  const { q = "", buscando = "" } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
  };

  const initialValues = useMemo<{ search: string }>(
    () => ({
      search: String(q),
    }),
    []
  );

  const {
    formValues,
    handleChange,
    setisSubmited,
    onResetForm,
    // setformValues,
  } = useForm(initialValues, {});
  const onLeaveSearch = () => {
    onResetForm();
    navigate("/menu");
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setisSubmited(true);
    if (formValues.search === "") {
      return onLeaveSearch();
    }
    navigate(`?q=${formValues.search}&buscando=true`);
  };
  return (
    <Box component={"form"} onSubmit={onSubmit} mt={0.75}>
      <TextField
        autoFocus
        fullWidth
        size="small"
        variant="outlined"
        label={"Buscar"}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onLeaveSearch();
          }
        }}
        value={formValues.search}
        onChange={handleChange}
        name="search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {buscando === "true" && (
                <IconButton
                  aria-label="Cancelar Busqueda"
                  onClick={() => {
                    onLeaveSearch();
                  }}
                  color="error"
                >
                  <Cancel />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
