import {
  Avatar,
  Badge,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { fileUpload } from "../../helpers";
import { Delete, Restore } from "@mui/icons-material";
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
  prevPhotos: string[];
  propiedad: string;
  error: boolean;
  helperText: string;
  setformValues: Dispatch<any>;
}) => {
  const [images, setImages] = useState<Photo[]>(
    prevPhotos.map((item) => ({
      url: item,
      antiguo: item,
      eliminado: false,
    }))
  );

  const [files, setFiles] = useState<
    {
      name: string;
      file: File;
    }[]
  >([]);
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //  PONER FOTOS CUANDO CAMBIA EL ITEM
    if (!prevPhotos.includes("nuevaImagen")) {
      setImages(
        prevPhotos.map((item) => ({
          url: item,
          antiguo: item,
          eliminado: false,
        }))
      );
    }
  }, [prevPhotos]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files?.length === 0) return;
    const filesArray = Array.from(event.target.files || []);
    setFiles(filesArray.map((item) => ({ name: item.name, file: item })));

    filesArray.forEach((files) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        // El resultado del archivo se encuentra en e.target.result

        setImages((prev) => [
          ...prev,
          {
            url: e.target?.result as string,
            eliminado: false,
            name: files.name,
          },
        ]);
      };
      reader.readAsDataURL(files); // lee el archivo como URL de datos
    });
    setformValues((prev: any) => ({
      ...prev,
      [propiedad]: [`nuevaImagen`],
    }));
  };

  const handleDeleteImage = (imageToDelete: Photo) => {
    setFiles(files.filter((item) => item.name !== imageToDelete.name));
    if (imageToDelete.name) {
      const resultado = images.filter(
        (item) => item.name !== imageToDelete.name
      );

      setImages(resultado);
      setformValues((prev: any) => ({
        ...prev,
        [propiedad]: resultado.length === 0 ? [] : prev[propiedad],
      }));
    } else {
      setImages(
        images.map((item) =>
          item.url === imageToDelete.url ? { ...item, eliminado: true } : item
        )
      );

      setformValues((prev: any) => {
        console.log({ images }, prev[propiedad]);

        return prev;
      });
    }
  };

  const handleUploadClick = () => {
    inputEl.current?.click();
  };

  return {
    getValues: () => ({ [propiedad]: images }),

    onSubmitUpload: async () => {
      const fileUploadPromises = [];
      for (const file of files) {
        fileUploadPromises.push(fileUpload(file.file));
      }

      const photosUrls = await Promise.all(fileUploadPromises);

      setTimeout(() => {
        setFiles([]);
      }, 0);
      setImages([]);
      const imagenesPrevias = images
        .filter((image) => !image.name && !image.eliminado)
        .map((image) => ({ error: false, url: image.url }));

      return {
        [propiedad]: [...imagenesPrevias, ...photosUrls],
      };
    },

    ComponentUpload: (
      <>
        <Button
          aria-label=""
          color={error ? "error" : "secondary"}
          onClick={handleUploadClick}
          className="fullWidth"
        >
          {label} {helperText}
        </Button>
        <Box
          className="fullWidth"
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
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

          {images.map((image) => (
            <Badge
              badgeContent={
                <IconButton
                  aria-label="Eliminar"
                  onClick={() => handleDeleteImage(image)}
                  size="small"
                >
                  {image.eliminado ? (
                    <Restore color="success" fontSize="small" />
                  ) : (
                    <Delete color="error" fontSize="small" />
                  )}
                </IconButton>
              }
            >
              <Avatar
                alt={"label"}
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
        </Box>
      </>
    ),
  };
};
