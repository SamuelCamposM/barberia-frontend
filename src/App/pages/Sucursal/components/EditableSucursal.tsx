import { Acciones } from "../../../components";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { DeptoSuc, MunicipioSuc, SucursalItem } from "..";
import {
  SocketEmitSucursal,
  searchDepto,
  searchDeptoProps,
  searchMunicipio,
  searchMunicipioProps,
} from "../helpers";

import { useForm, useProvideSocket } from "../../../../hooks";
import { Dispatch, useMemo, useState } from "react";
import { handleSocket, required } from "../../../../helpers";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

import { useMenuStore } from "../../Menu";
import { useDebouncedCallback } from "../../../hooks";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { useNavigate } from "react-router-dom";

export const EditableSucursal = ({
  sucursal,
  setAgregando,
  setEditando,
  esNuevo,
  actionsJoins = [],
}: {
  actionsJoins?: Action[];
  sucursal: SucursalItem;
  esNuevo?: boolean;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso, getPathPage } = useMenuStore();
  const navigate = useNavigate();
  const { socket } = useProvideSocket();
  const config = useMemo(
    () => ({
      "depto.name": [required],
      "municipio.name": [required],
      name: [required],
      tel: [required],
      direccion: [required],
    }),
    []
  );

  const {
    formValues,
    handleChange,
    errorValues,
    handleBlur,
    isFormInvalidSubmit,
    setisSubmited,
    cargandoSubmit,
    setCargandoSubmit,
    onNewForm,
    setformValues,
  } = useForm(sucursal, config);

  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitSucursal.agregar,
      { ...formValues },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        refs["depto.name"].current?.focus();
        onNewForm(sucursal);
        // setSliceAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    socket?.emit(
      SocketEmitSucursal.editar,
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        return setEditando(false);
      }
    );
  };
  const onSubmit = () => {
    setisSubmited(true);
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
    setCargandoSubmit(true);
    if (esNuevo) {
      handleGuardar();
    } else {
      handleEditar();
    }
  };
  const [deptosData, setDeptosData] = useState<DeptoSuc[]>([formValues.depto]);

  const handleSearchDepto = async ({ search }: searchDeptoProps) => {
    if (required(search) !== "") return;
    const { data } = await searchDepto({ search });
    setDeptosData(data.length === 0 ? [formValues.depto] : data);
  };
  const debounceSearchDepto = useDebouncedCallback(handleSearchDepto);

  const [municipiosData, setMunicipiosData] = useState<MunicipioSuc[]>([
    formValues.municipio,
  ]);

  const handleSearchMunicipio = async ({
    search,
    deptoId,
  }: searchMunicipioProps) => {
    const { data } = await searchMunicipio({ search, deptoId });
    setMunicipiosData(data.length === 0 ? [formValues.municipio] : data);
  };
  const debounceSearchMunicipio = useDebouncedCallback(handleSearchMunicipio);

  const { defaultPropsGenerator, refs } = useFieldProps({
    config,
    formValues,
    errorValues,
    handleChange,
    handleBlur,
    handleKeyDown: (e: React.KeyboardEvent) => {
      handleNavigation(e, config, refs);
      if (e.key === "Enter" && e.shiftKey) {
        onSubmit();
      }
      if (e.key === "Escape") {
        onClickEditar();
      }
    },
  });
  const { Icono, path } = useMemo(() => getPathPage("Depto"), []);
  return (
    <StyledTableRow key={sucursal._id} crud={sucursal.crud}>
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "error",
              disabled: cargandoSubmit,
              Icon: CancelOutlined,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
            },
            {
              color: "success",
              disabled: cargandoSubmit,
              Icon: Check,
              name: `Guardar cambios`,
              onClick: () => {
                onSubmit();
              },
              tipo: "icono",
              size: "small",
            },
            ...actionsJoins,
          ]}
        />
      </StyledTableCell>
      <>
        <StyledTableCell>
          <Autocomplete
            options={deptosData}
            disableClearable={false}
            value={
              deptosData.some((option) => option._id === formValues.depto._id)
                ? formValues.depto
                : null
            }
            getOptionLabel={(value) => value.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setformValues((prev) => ({
                ...prev,
                depto: newValue,
              }));
              handleSearchMunicipio({ deptoId: newValue._id, search: "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("depto.name", true, false)}
                autoFocus
                onChange={({ target }) => {
                  debounceSearchDepto({ search: target.value });
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: { paddingRight: "0px !important" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={`agregar ${path}`}>
                        <IconButton
                          aria-label=""
                          onClick={() => {
                            navigate(path);
                          }}
                        >
                          {Icono}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </StyledTableCell>
        <StyledTableCell>
          <Autocomplete
            options={municipiosData}
            disableClearable={false}
            value={
              municipiosData.some(
                (option) => option._id === formValues.municipio._id
              )
                ? formValues.municipio
                : null
            }
            getOptionLabel={(value) => value.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_, newValue) => {
              if (!newValue) return;

              setformValues((prev) => ({
                ...prev,
                municipio: newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("municipio.name", true, false)}
                onChange={({ target }) => {
                  debounceSearchMunicipio({
                    search: target.value,
                    deptoId: formValues.depto._id,
                  });
                }}
              />
            )}
          />
        </StyledTableCell>
        <StyledTableCell>
          <TextField {...defaultPropsGenerator("name", true, true)} />
        </StyledTableCell>

        <StyledTableCell>
          <TextField {...defaultPropsGenerator("tel", true, true)} />
        </StyledTableCell>
        <StyledTableCell>
          <TextField {...defaultPropsGenerator("direccion", true, true)} />
        </StyledTableCell>
      </>
    </StyledTableRow>
  );
};
