import { InputAdornment, IconButton } from "@mui/material";
import { SocketContext } from "../../../../context";
import { required } from "../../../../helpers";
import { useAuthStore, useChatStore, useForm } from "../../../../hooks";
import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { Send } from "@mui/icons-material";

import { useEffect, useRef } from "react";

export const SendMessage = ({ name }: { name: string }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useAuthStore();
  const { chatActivo } = useChatStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    formValues,
    handleChange,
    handleBlur,
    errorValues,
    onResetForm,
    setisSubmited,
    isFormInvalidSubmit,
  } = useForm({ mensaje: "" }, { mensaje: [required] });

  const { mensaje } = formValues;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleBlur();
    setisSubmited(true);
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
    onResetForm();

    socket?.emit("mensaje-personal", {
      de: user.uid,
      para: chatActivo,
      mensaje,
    });
  };
  useEffect(() => {
    console.log("focus");

    inputRef.current?.select();
  }, [name]);

  return (
    <form onSubmit={handleSubmit}>

      <TextField
        autoFocus
        inputRef={inputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="Enviar" type="submit">
                <Send color="success"></Send>
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
        name="mensaje"
        label="Mensaje"
        value={mensaje}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errorValues.mensaje.length > 0}
        helperText={errorValues.mensaje.join(" - ")}
      />
    </form>
  );
};
