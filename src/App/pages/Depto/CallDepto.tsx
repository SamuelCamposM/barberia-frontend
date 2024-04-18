import { IconButton, Tooltip } from "@mui/material";
import { ModalLayout } from "../../components";
import {
  StyledContainerForm,
  StyledModalBoxHeader,
  StyledTypographyHeader,
} from "../../components/style";
import { Cancel } from "@mui/icons-material";
import Depto from "./Depto";
import { useNavigate } from "react-router-dom";
import { getSubPath } from "../../../helpers";
import { useModalConfig } from "../../hooks";
// import { usePath } from "../../../hooks";

export const CallDepto = () => {
  const { idModal, vhContainer, width } = useModalConfig("idModalDepto");
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(getSubPath(location.pathname));
  };
  return (
    <ModalLayout
      idModal={idModal}
      open
      setOpen={() => {}}
      vh={vhContainer.height}
      width={width}
    >
      <>
        <StyledModalBoxHeader>
          <StyledTypographyHeader color={"primary"} id={idModal}>
            Departamentos
          </StyledTypographyHeader>
          <Tooltip title="Cancelar">
            <IconButton
              aria-label="Cancelar"
              onClick={handleClose}
              color="error"
            >
              <Cancel />
            </IconButton>
          </Tooltip>
        </StyledModalBoxHeader>

        <StyledContainerForm {...vhContainer}>
          <Depto />
        </StyledContainerForm>
      </>
    </ModalLayout>
  );
};
