import { FormEvent, useMemo } from "react";
import { useForm } from "../../../hooks";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Cancel } from "@mui/icons-material";

export const Buscador = ({
  label = "Buscar",
  buscando,
  onSearch,
  onSearchCancel,
}: {
  label?: string;
  buscando: boolean;
  onSearch: (arg: string) => void;
  onSearchCancel: () => void;
}) => {
  const initialValues = useMemo<{ search: string }>(
    () => ({
      search: "",
    }),
    []
  );

  const {
    formValues,
    handleChange,
    setisSubmited,
    // onResetForm,
    setformValues,
  } = useForm(initialValues, {});
  const onLeaveSearch = () => {
    setformValues({ search: "" });
    onSearchCancel();
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setisSubmited(true);
    if (formValues.search === "") {
      return onLeaveSearch();
    }
    onSearch(formValues.search);
  };
  return (
    <Box component={"form"} onSubmit={onSubmit}>
      <TextField
        autoFocus
        fullWidth
        size="small"
        variant="outlined"
        label={label}
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
              {buscando && (
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
