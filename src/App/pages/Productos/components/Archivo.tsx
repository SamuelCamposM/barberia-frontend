import { Avatar, Badge, Box, Button, IconButton } from "@mui/material";
import { useRef } from "react";
import { Delete } from "@mui/icons-material";
import { NuevoDoc, PhotoData, processObject } from "../../../../helpers";
interface PhotoDataIndexSignature {
  [key: string]: PhotoData;
}

export const Archivo = <T extends PhotoDataIndexSignature>({
  dataFile,
  error,
  helperText,
  label,
  propiedad,
  setDataFile,
  setformValues,
  handleBlur,
}: {
  dataFile?: PhotoData;
  label: string;
  propiedad: keyof T; // propiedad es una clave de T
  error: boolean;
  helperText: string;
  setDataFile: React.Dispatch<React.SetStateAction<T>>;
  setformValues: React.Dispatch<React.SetStateAction<any>>;
  handleBlur: () => void;
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target?.files?.length === 0) return;
    const filesArray = Array.from(event.target.files || []);
    //* files

    let newsToShowArray: PhotoData["newsToShow"] = [];

    // Use Promise.all with map instead of forEach
    await Promise.all(
      filesArray.map((files) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            newsToShowArray.push({
              urlTemp: e.target?.result as string,
              name: files.name,
            });
            resolve(null); // Resolve the promise when onload is done
          };
          reader.onerror = reject; // Reject the promise if there's an error
          reader.readAsDataURL(files); // lee el archivo como URL de datos
        });
      })
    );

    // Now it should print the expected array

    const formatedFilesArray: PhotoData["newFiles"] = filesArray.map(
      (item) => ({
        name: item.name,
        file: item,
      })
    );

    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          newsToShow: [...prev[propiedad].newsToShow, ...newsToShowArray],
          newFiles: [...prev[propiedad].newFiles, ...formatedFilesArray],
        },
      };

      const { values } = processObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };

  const handleDeleteImageNew = (fileNuevo: NuevoDoc) => {
    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          newFiles: prev[propiedad].newFiles.filter(
            (fileItem) => fileItem.name !== fileNuevo.name
          ),
          newsToShow: prev[propiedad].newsToShow.filter(
            (fileItem) => fileItem.name !== fileNuevo.name
          ),
        },
      };
      const { values } = processObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };
  const handleDeleteImageOld = (oldImage: string) => {
    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          antiguos: prev[propiedad].antiguos.filter(
            (fileItem) => fileItem !== oldImage
          ),
          eliminados: [...prev[propiedad].eliminados, oldImage],
        },
      };
      const { values } = processObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };

  const handleUploadClick = () => {
    inputEl.current?.click();
  };

  // useEffect(() => {
  // const { values } = processObject({ [propiedad]: dataFile });

  // setformValues((prev: any) => ({ ...prev, ...values }));
  // }, [dataFile]);

  return (
    <>
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

          {dataFile &&
            [...dataFile.newsToShow].map((fileNuevo) => (
              <Badge
                badgeContent={
                  <IconButton
                    aria-label="Eliminar"
                    onClick={() => handleDeleteImageNew(fileNuevo)}
                    size="small"
                  >
                    <Delete color="error" fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  alt={"label"}
                  src={fileNuevo.urlTemp}
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
          {dataFile &&
            [...dataFile.antiguos].map((fileNuevo) => (
              <Badge
                badgeContent={
                  <IconButton
                    aria-label="Eliminar"
                    onClick={() => handleDeleteImageOld(fileNuevo)}
                    size="small"
                  >
                    <Delete color="error" fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  alt={"label"}
                  src={fileNuevo}
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
    </>
  );
};
