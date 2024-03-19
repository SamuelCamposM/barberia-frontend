import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { useMenuStore } from "../../hooks";
import { convertirPath } from "../../helpers";
import { ConvertirComponente } from "../hooks";
const ChatPage = lazy(() => import("../pages/Chat/ChatPage"));

export const ContentRouter = () => {
  const { rows } = useMenuStore();

  if (rows.length === 0) {
    return "CARGANDO";
  }
  return (
    <Routes>
      {rows.map(({ nombre, _id }) => {
        return (
          <Route
            key={_id}
            path={convertirPath(nombre)}
            element={ConvertirComponente(nombre)}
          />
        );
      })}
      <Route path={"/chat/*"} element={<ChatPage />} />

      {/* Aquí se redirige a la primera página si la ruta no coincide */}
      <Route path="*" element={<Navigate replace to="menu" />} />
    </Routes>
  );
};

export default ContentRouter;
