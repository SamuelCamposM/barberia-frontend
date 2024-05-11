import { RootState } from "../../../../store/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { VentaItem } from "../interfaces";
import { setSliceItemActive, setSliceOpenModal } from "../store";
import { useThemeSwal } from "../../../hooks";
import Swal from "sweetalert2";
export const useVentaStore = () => {
  const { openModal, itemActive, itemDefault } = useSelector(
    (state: RootState) => state.venta
  );

  const themeSwal = useThemeSwal();
  const dispatch = useDispatch();

  const setOpenModal = (value: boolean) => {
    dispatch(setSliceOpenModal(value));
  };
  const setItemActive = async (
    itemToActive: VentaItem,
    sinValidacion?: boolean
  ) => {
    if (sinValidacion) {
      dispatch(setSliceItemActive(itemToActive));
      return true;
    }

    const isEditingToDefault =
      itemActive._id && !itemToActive.crud?.agregando && !itemToActive._id;

    const isNewToEditing = itemActive.crud?.agregando && itemToActive._id;

    const isDefaultToNew =
      !itemActive._id &&
      !itemActive.crud?.agregando &&
      itemToActive.crud?.agregando;

    const isDefaultToEdit =
      !itemActive._id && !itemActive.crud?.agregando && itemToActive._id;

    const isChangingStateWithNew =
      itemActive.crud?.agregando &&
      !itemToActive._id &&
      !itemToActive.crud?.agregando;

    const isChangingStateWitDefault =
      !itemActive._id &&
      !itemActive.crud?.agregando &&
      !itemToActive._id &&
      !itemToActive.crud?.agregando;
    const isEditingTheSame =
      itemActive._id === itemToActive._id && !itemActive.crud?.agregando;
    const isEditingAnother =
      itemActive._id !== itemToActive._id && itemActive._id;

    if (isEditingTheSame) {
      dispatch(setSliceItemActive(itemToActive));
      return true;
    }

    if (isChangingStateWithNew) {
      // dispatch(setSliceItemActive(itemToActive));
      return true;
    }

    if (isChangingStateWitDefault) {
      // dispatch(setSliceItemActive(itemToActive));
      return true;
    }

    if (isDefaultToNew || isDefaultToEdit) {
      dispatch(setSliceItemActive(itemToActive));
      return true;
    }
    // Si el venta está cambiando de tab, actualiza el item estado
    if (isEditingToDefault) {
      const result = await Swal.fire({
        title: `Estás editando un venta`,
        text: "Si realizas esta acción Los cambios no se guardarán.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      });

      if (result.isConfirmed) {
        dispatch(setSliceItemActive(itemToActive));
        return true;
      }
      if (result.isDismissed) {
        return false;
      }
    }

    if (isNewToEditing) {
      const result = await Swal.fire({
        title: `Estás creando un venta`,
        text: "Si realizas esta acción Los cambios no se guardarán.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      });
      if (result.isConfirmed) {
        dispatch(setSliceItemActive(itemToActive));
        return true;
      }
    }
    if (isEditingAnother) {
      const result = await Swal.fire({
        title: `Estas editando un venta`,
        text: "Si realizas esta acción Los cambios no se guardarán.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      });
      if (result.isConfirmed) {
        dispatch(setSliceItemActive(itemToActive));
        return true;
      }
    }
    // Si el venta está en el estado por defecto, no hace nada

    return false;
  };

  return {
    //Propiedades
    openModal,
    itemActive,
    itemDefault,
    //Metodos
    setOpenModal,
    setItemActive,
  };
};
