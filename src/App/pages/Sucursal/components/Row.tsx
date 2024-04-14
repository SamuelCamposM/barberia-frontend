import React, {
  Dispatch,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Acciones } from "../../../components";
import { DeptoSuc, MunicipioSuc, SucursalItem } from "..";
import { ErrorSocket } from "../../../../interfaces/global";
import { handleSocket, required } from "../../../../helpers";
import {
  SocketEmitSucursal,
  searchDeptoProps,
  searchMunicipio,
  searchDepto,
  searchMunicipioProps,
} from "../helpers";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useForm, useProvideSocket } from "../../../../hooks";
import Swal from "sweetalert2";
import {
  Add,
  CancelOutlined,
  Check,
  Create,
  DeleteForever,
} from "@mui/icons-material";
import {
  useResaltarTexto,
  useThemeSwal,
  useDebouncedCallback,
} from "../../../hooks";
import { useMenuStore } from "../../Menu";
export const Row = ({
  sucursal,
  q = "",
  setAgregando,
}: {
  sucursal: SucursalItem;
  q?: string;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const themeSwal = useThemeSwal();
  const [editando, setEditando] = useState(!Boolean(sucursal._id));
  const esNuevo = useMemo(() => !Boolean(sucursal._id), []);
  const config = useMemo(
    () => ({
      "municipio.name": [required],
      "sucursal.name": [required],
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
    onNewForm,
    isFormInvalidSubmit,
    setisSubmited,
    cargandoSubmit,
    setCargandoSubmit,
    setformValues,
  } = useForm(sucursal, config);

  const onClickEdit = () => {
    if (noTienePermiso("Sucursal", "update")) {
      setCargandoSubmit(false);
      return;
    }
    setEditando((prev) => !prev);
    onNewForm(sucursal);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitSucursal.agregar,
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;

        setAgregando!(false);
      }
    );
  };
  const handleEditar = () => {
    const itemToEdit: SucursalItem = { ...sucursal, ...formValues };
    socket?.emit(
      SocketEmitSucursal.editar,
      itemToEdit,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setEditando(false);
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

  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Sucursal", "delete")) {
      return;
    }
    Swal.fire({
      title: `Desea eliminar el Sucursal`,
      text: sucursal.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitSucursal.eliminar,
          { _id: sucursal._id },
          ({ error, msg }: ErrorSocket) => {
            handleSocket({ error, msg });
            if (error) return;
          }
        );
      }
    });
  }, []);
  const defaultProps = {
    fullWidth: true,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onSubmit();
      }
    },
    autoComplete: "false",
  };
  const [deptosData, setDeptosData] = useState<DeptoSuc[]>([]);
  const handleSearchDepto = async ({ search }: searchDeptoProps) => {
    if (required(search) !== "") return;
    const { data } = await searchDepto({ search });
    setDeptosData(data);
  };
  const debounceSearchDepto = useDebouncedCallback(handleSearchDepto);

  const [municipiosData, setMunicipiosData] = useState<MunicipioSuc[]>([]);
  const handleSearchMunicipio = async ({
    search,
    deptoId,
  }: searchMunicipioProps) => {
    const { data } = await searchMunicipio({ search, deptoId });
    setMunicipiosData(data);
  };
  const debounceSearchMunicipio = useDebouncedCallback(handleSearchMunicipio);

  return (
    <>
      <StyledTableRow
        key={sucursal._id}
        crud={sucursal.crud}
        onDoubleClick={() => {
          // handleEditar(row);
          // setActiveRow(row);
        }}
        // onMouseEnter={() => setshowButtoms(true)}
        // onMouseLeave={() => setshowButtoms(false)}
        // className={`${
        //rowActive._id === row._id &&
        //"animate__animated animate__lightSpeedInRight"
        // }`}
      >
        <StyledTableCell
          padding="checkbox"
          // className={`pendingActive ${
          //rowActive._id === row._id && "active"
          // }`}
        >
          <Acciones
            actions={[
              {
                color: editando ? "error" : "primary",
                disabled: cargandoSubmit,
                Icon: editando ? CancelOutlined : Create,
                name: `Editar`,
                onClick: () => {
                  onClickEdit();
                },
                tipo: "icono",
                size: "small",
                ocultar: esNuevo,
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
                ocultar: !editando,
              },
              {
                color: "error",
                Icon: DeleteForever,
                name: `Eliminar`,
                onClick: () => {
                  handleEliminar();
                },
                tipo: "icono",
                size: "small",
                ocultar: esNuevo || editando,
              },
            ]}
          />
        </StyledTableCell>
        {editando ? (
          <>
            <StyledTableCell>
              <Autocomplete
                options={deptosData}
                disableClearable={false}
                value={formValues.sucursal}
                getOptionLabel={(value) => value.name}
                onChange={(_, newValue) => {
                  if (!newValue) return;
                  setformValues((prev) => ({
                    ...prev,
                    sucursal: newValue,
                  }));
                  handleSearchMunicipio({
                    search: "",
                    deptoId: newValue._id,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    error={errorValues["sucursal.name"].length > 0}
                    onBlur={handleBlur}
                    helperText={errorValues["sucursal.name"].join(" - ")}
                    onChange={({ target }) => {
                      debounceSearchDepto({ search: target.value });
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { paddingRight: "0px !important" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Ver iconos">
                            <IconButton aria-label="" onClick={() => {}}>
                              <Add />
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
                value={formValues.municipio}
                getOptionLabel={(value) => value.name}
                disabled={formValues.sucursal._id === ""}
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
                    autoFocus
                    error={errorValues["municipio.name"].length > 0}
                    onBlur={handleBlur}
                    helperText={errorValues["municipio.name"].join(" - ")}
                    onChange={({ target }) => {
                      debounceSearchMunicipio({
                        search: target.value,
                        deptoId: formValues.sucursal._id,
                      });
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { paddingRight: "0px !important" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Ver iconos">
                            <IconButton aria-label="" onClick={() => {}}>
                              <Add />
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
              <TextField
                {...defaultProps}
                value={formValues.name}
                onChange={handleChange}
                name="name"
                error={errorValues.name.length > 0}
                onBlur={handleBlur}
                helperText={errorValues.name.join(" - ")}
              />
            </StyledTableCell>
            <StyledTableCell>
              <TextField
                {...defaultProps}
                value={formValues.tel}
                onChange={handleChange}
                name="tel"
                error={errorValues.tel.length > 0}
                onBlur={handleBlur}
                helperText={errorValues.tel.join(" - ")}
              />
            </StyledTableCell>
            <StyledTableCell>
              <TextField
                {...defaultProps}
                value={formValues.direccion}
                onChange={handleChange}
                name="direccion"
                error={errorValues.direccion.length > 0}
                onBlur={handleBlur}
                helperText={errorValues.direccion.join(" - ")}
              />
            </StyledTableCell>
          </>
        ) : (
          <>
            <StyledTableCell>
              {useResaltarTexto({ busqueda: q, texto: sucursal.sucursal.name })}
            </StyledTableCell>
            <StyledTableCell>
              {useResaltarTexto({
                busqueda: q,
                texto: sucursal.municipio.name,
              })}
            </StyledTableCell>
            <StyledTableCell>
              {useResaltarTexto({ busqueda: q, texto: sucursal.name })}
            </StyledTableCell>
            <StyledTableCell>
              {useResaltarTexto({ busqueda: q, texto: sucursal.tel })}
            </StyledTableCell>
            <StyledTableCell>
              {useResaltarTexto({ busqueda: q, texto: sucursal.direccion })}
            </StyledTableCell>
          </>
        )}
      </StyledTableRow>
    </>
  );
};
