import { useMenuStore } from "../../../../hooks";
import { ModalLayout } from "../../../components";

export const ModalMenu = () => {
  const { openModal, onToggleOpenMenu } = useMenuStore();
  return (
    <>
      <ModalLayout open={openModal} setOpen={onToggleOpenMenu}></ModalLayout>
    </>
  );
};
