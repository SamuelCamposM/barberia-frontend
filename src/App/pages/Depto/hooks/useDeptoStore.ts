import { getSliceDataDepto } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getDepto } from "../helpers";
export const useDeptoStore = () => {
  const dispatch = useDispatch();
  const { rows } = useSelector((state: RootState) => state.depto);

  const getDataDepto = async () => {
    const res = await getDepto();
    console.log({ res });
  };

  return {
    getDataDepto,
  };
};
