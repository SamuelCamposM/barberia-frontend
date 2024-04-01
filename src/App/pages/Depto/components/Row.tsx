import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import { Acciones, Cargando, TablaLayout } from "../../../components";
import { DeptoItem, useDeptoStore } from "..";
import { ErrorSocket } from "../../../../interfaces/global";
import { handleSocket, required } from "../../../../helpers";
import { SocketEmitEvent } from "../helpers";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../components/style";
import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, useProvideSocket } from "../../../../hooks";
import Swal from "sweetalert2";
import {
  CancelOutlined,
  Check,
  Create,
  DeleteForever,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useThemeSwal } from "../../../hooks";
export const Row = ({ depto }: { depto: DeptoItem }) => {
  const { socket } = useProvideSocket();
  const { setAgregando } = useDeptoStore();

  const themeSwal = useThemeSwal();
  const [editando, setEditando] = useState(!Boolean(depto._id));
  const esNuevo = useMemo(() => !Boolean(depto._id), []);
  const [open, setopen] = useState(false);
  const config = useMemo(
    () => ({
      name: [required],
    }),
    []
  );
  const propsUseForm = useCallback(
    (item: DeptoItem) => ({
      name: item.name,
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
  } = useForm(propsUseForm(depto), config);
  const handleGuardar = () => {
    socket?.emit(
      SocketEmitEvent.agregar,
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;

        setAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    const itemToEdit: DeptoItem = { ...depto, ...formValues };
    socket?.emit(
      SocketEmitEvent.editar,
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
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: depto.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitEvent.eliminar,
          { _id: depto._id },
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

  return (
    <>
      <StyledTableRow
        key={depto._id}
        crud={depto.crud}
        onDoubleClick={() => {
          // handleEditar(row);
          // setActiveRow(row);
        }}
        // onMouseEnter={() => setshowButtoms(true)}
        // onMouseLeave={() => setshowButtoms(false)}
        // className={`${
        //   rowActive._id === row._id &&
        //   "animate__animated animate__lightSpeedInRight"
        // }`}
      >
        <StyledTableCell
          padding="checkbox"
          // className={`pendingActive ${
          //   rowActive._id === row._id && "active"
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
                  setEditando((prev) => !prev);
                  onNewForm(propsUseForm(depto));
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
              {
                color: "secondary",
                Icon: open ? ExpandLess : ExpandMore,
                name: `Ver municipios`,
                onClick: () => {
                  setopen(!open);
                },
                tipo: "icono",
                size: "small",
                ocultar: esNuevo,
              },
            ]}
          />
        </StyledTableCell>
        {editando ? (
          <>
            <StyledTableCell>
              <TextField
                {...defaultProps}
                autoFocus
                value={formValues.name}
                onChange={handleChange}
                name="name"
                error={errorValues.name.length > 0}
                onBlur={handleBlur}
                helperText={errorValues.name.join(" - ")}
              />
            </StyledTableCell>
            <StyledTableCell>{depto.totalMunicipios}</StyledTableCell>
          </>
        ) : (
          <>
            <StyledTableCell>{depto.name}</StyledTableCell>
            <StyledTableCell>{depto.totalMunicipios}</StyledTableCell>
          </>
        )}
      </StyledTableRow>
      <TableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
              }}
            >
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>{" "}
              {/* <Cargando/> */}
              <StyledTableContainer
                className="animate__animated animate__slideInRight"
                sx={{ maxHeight: "30vh", overflow: "scroll" }}
              >
                <Table size="small" stickyHeader aria-label="sticky table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-1",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-1xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-1xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-1xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-1xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-1xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-2xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-2xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-2xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-3",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-3xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-3xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-3xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-3xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-3xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-4",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-4xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-4xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-4xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-4xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-4xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-5",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-5xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-5xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-5xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-5xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-5xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-6",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-6xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-6xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-6xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-6xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-6xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-7",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-7xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-7xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-7xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-7xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-7xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-8",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-8xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-8xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-8xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-8xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-8xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-9",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-9xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-9xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-9xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-9xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50-9xd2xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50- 10",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50- 10xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50- 10xd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50- 10xdxd",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50- 10xd2",
                      },
                      {
                        data: "asad",
                        price: 8,
                        amount: 5,
                        customerId: 5,
                        date: "15-50- 10xd2xd",
                      },
                    ].map((historyRow) => (
                      <StyledTableRow key={historyRow.date}>
                        <StyledTableCell component="th" scope="row">
                          {historyRow.date}
                        </StyledTableCell>
                        <StyledTableCell>
                          {historyRow.customerId}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
