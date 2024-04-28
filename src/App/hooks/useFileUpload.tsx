import { Avatar, Badge, Box, Typography, IconButton } from "@mui/material";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { fileUpload } from "../../helpers";
import { Delete } from "@mui/icons-material";
import { Photo } from "../../interfaces/global";

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
  const [image, setImage] = useState<Photo>({
    url: prevUrl,
    antiguo: prevUrl,
    eliminado: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prevUrl !== "url" && prevUrl !== "") {
      setImage({
        url: prevUrl,
        antiguo: prevUrl,
        eliminado: false,
      });
    }
  }, [prevUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage((prev) => ({
        ...prev,
        url: e.target?.result as string,
        eliminado: true,
      }));
      setformValues((prev: any) => ({
        ...prev,
        [propiedad]: "url",
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setFile(null);
    setImage((prev) => ({
      ...prev,
      url: "",
      eliminado: true,
    }));
    setformValues((prev: any) => ({ ...prev, [propiedad]: "" }));
  };

  const handleUploadClick = () => {
    inputEl.current?.click();
  };

  return {
    getValues: () => ({ [propiedad]: image }),

    onSubmitUpload: async () => {
      const res = await fileUpload(file);

      setTimeout(() => {
        setFile(null);
      }, 0);
      setImage({ ...image, eliminado: false });
      return {
        [propiedad]: {
          image: {
            ...image,
            url: res.url || image.url,
          },
          error: res.error ? `Hubo un error al subir ${label}` : false,
        },
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
          onChange={handleFileChange}
        />
        <Badge
          badgeContent={
            <IconButton aria-label="" onClick={handleDeleteImage} size="small">
              <Delete color="error" fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            onClick={handleUploadClick}
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
        <Typography variant="overline" color={error ? "error" : "secondary"}>
          {file?.name || label} {error && ` - ${helperText}`}
        </Typography>
      </Box>
    ),
  };
};
