import { ConvertirComponente } from "../helpers";
import { convertirPath } from "../../helpers";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { useMenuStore } from "../pages/Menu";

const ChatPage = lazy(() => import("../pages/Chat/ChatPage"));

export const ContentRouter = () => {
  const { rows } = useMenuStore();
  const { user } = useAuthStore();
  if (rows.length === 0) {
    return "CARGANDO";
  }
  return (
    <Routes>
      {rows
        .filter(({ ver }) => ver.includes(user.rol))
        .map(({ nombre, _id, componente }) => {
          return (
            <Route
              key={_id}
              path={convertirPath(nombre) + "/*"}
              element={ConvertirComponente(componente)}
            />
          );
        })}
      <Route path={"/chat/*"} element={<ChatPage />} />

      {/* Aquí se redirige a la primera página si la ruta no coincide */}
      <Route
        path="*"
        element={<Navigate replace to={convertirPath(rows[0].nombre)} />}
      />
    </Routes>
  );
};

export default ContentRouter;
