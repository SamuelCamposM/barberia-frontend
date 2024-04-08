import { Avatar, Badge, Box, Typography, IconButton } from "@mui/material";
import React, { Dispatch, useRef, useState } from "react";
import { fileUpload } from "../../helpers";
import { Delete } from "@mui/icons-material";

export const useFileUpload = ({
  label,
  prevUrl,
  propiedad,
  error,
  helperText,
  setformValues,
}: {
  label: string;
  prevUrl: string;
  propiedad: string;
  error: boolean;
  helperText: string;
  setformValues: Dispatch<any>;
}) => {
  const [eliminado, setEliminado] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    // `current` apunta al campo de entrada montado en el DOM
    inputEl.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEliminado(true);
      setFile(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        // El resultado del archivo se encuentra en e.target.result
        // console.log("Contenido del archivo:", e.target?.result);
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file); // lee el archivo como URL de datos
    }
  };
  const deleteImage = () => {
    setEliminado(true);
    setformValues((prev: any) => ({ ...prev, [propiedad]: "" }));
  };
  return {
    onSubmitUpload: async () => {
      const res = await fileUpload(file);
      setFile(null);
      setImage(null);
      setEliminado(false);
      return {
        config: {
          error: res.error ? `Hubo un error al subir ${label}` : false,
          eliminado,
          prevUrl,
        },
        data: { [propiedad]: res.url || prevUrl },
      };
    },
    ComponentUpload: (
      <Box
        className="fullWidth"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        mt={1}
      >
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputEl}
          onChange={handleFileUpload}
        />
        <Badge
          badgeContent={
            <IconButton aria-label="" onClick={deleteImage} size="small">
              <Delete color="error" fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            onClick={onButtonClick}
            alt={label}
            src={image || prevUrl}
            sx={{
              width: 100,
              height: 100,
              transition: "opacity .3s",
              ":hover": {
                opacity: 0.75,
              },
            }}
          />
        </Badge>
        <Typography variant="overline" color={error ? "error" : "secondary"}>
          {file?.name || label} {error && ` - ${helperText}`}
        </Typography>
      </Box>
    ),
  };
};
