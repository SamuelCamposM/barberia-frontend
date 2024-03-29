import { toast } from "react-toastify";
import { DataAlerta } from "../../App/components";
import { ErrorSocket } from "../../interfaces/global";

export const handleSocket = ({ error, msg, subtitulo }: ErrorSocket) => {
  if (error) {
    toast.error(<DataAlerta titulo={msg} />);
  }
  if (!error) {
    toast.success(<DataAlerta titulo={msg} subtitulo={subtitulo} />);
  }
};
