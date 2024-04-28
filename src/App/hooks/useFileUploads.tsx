import { Avatar, Badge, Box, Typography, IconButton } from "@mui/material";
import React, { Dispatch, useCallback, useRef, useState } from "react";
import { Delete, Upload } from "@mui/icons-material";
import { Photo } from "../../interfaces/global";

export const useFileUploads = ({
  label,
  prevPhotos,
  propiedad,
  error,
  helperText,
  setformValues,
}: {
  label: string;
  prevPhotos: Photo[];
  propiedad: string;
  error: boolean;
  helperText: string;
  setformValues: Dispatch<any>;
}) => {
  const [images, setImages] = useState<Photo[]>(prevPhotos);
  const [files, setFiles] = useState<File[]>([]);
  const inputEl = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    // `current` apunta al campo de entrada montado en el DOM
    inputEl.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files?.length === 0) return;
    const filesArray = Array.from(event.target.files || []);
    setFiles(filesArray);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        // El resultado del archivo se encuentra en e.target.result
        setImages((prevImages) => [
          ...prevImages,
          {
            url: e.target?.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file); // lee el archivo como URL de datos
    });
  };

  const deleteImage = useCallback(
    (imageToDelete: Photo) => {
      console.log({ files, images, imageToDelete });
    },
    [images, files]
  );

  return {
    onSubmitUpload: async () => {
      // const res = await fileUpload(file);

      // setTimeout(() => {
      //   setFile(null);
      //   setImage(null);
      // }, 0);

      return {
        config: {
          error: false,
          prevPhotos,
        },
        data: { [propiedad]: prevPhotos },
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
          multiple
        />

        <IconButton
          aria-label="Subir imagen"
          onClick={onButtonClick}
          size="small"
        >
          <Upload color="error" fontSize="small" />
        </IconButton>

        {images?.map((image) => (
          <Badge
            badgeContent={
              <IconButton onClick={() => deleteImage(image)} size="small">
                <Delete color="error" fontSize="small" />
              </IconButton>
            }
          >
            <Avatar
              alt={label}
              src={image.url}
              sx={{
                width: 125,
                height: 125,
                transition: "opacity .3s",
                ":hover": {
                  opacity: 0.75,
                },
              }}
            />
          </Badge>
        ))}
        <Typography variant="overline" color={error ? "error" : "secondary"}>
          {label} {error && ` - ${helperText}`}
        </Typography>
      </Box>
    ),
  };
};
