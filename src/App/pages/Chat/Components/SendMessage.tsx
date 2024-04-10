import { InputAdornment, IconButton } from "@mui/material";
import { required } from "../../../../helpers";
import {
  useAuthStore,
  useChatStore,
  useForm,
  useProvideSocket,
} from "../../../../hooks";
import TextField from "@mui/material/TextField";
import { Send } from "@mui/icons-material";

import { useEffect, useRef } from "react";

export const SendMessage = ({ name }: { name: string }) => {
  const { socket } = useProvideSocket();
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
