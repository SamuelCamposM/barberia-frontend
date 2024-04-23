import { ConvertirComponente, convertirPath } from "../../helpers";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { useMenuStore } from "../pages/Menu";
import { Cargando } from "../components";

const ChatPage = lazy(() => import("../pages/Chat/ChatPage"));

export const ContentRouter = () => {
  const { data } = useMenuStore();
  const { usuario } = useAuthStore();
  if (data.length === 0) {
    return <Cargando titulo="Cargando" />;
  }
  return (
    <Routes>
      {data
        .filter(({ ver }) => ver.includes(usuario.rol))
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
      <Route
        path="*"
        element={<Navigate replace to={convertirPath(data[0].nombre)} />}
      />
    </Routes>
  );
};

export default ContentRouter;
