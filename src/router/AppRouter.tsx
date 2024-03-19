import { useEffect } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../hooks";
import { AuthRouter } from "../Auth";
import { MainPage } from "../App";

export const AppRouter = () => {
  const { status, onStartSheckAuthToken } = useAuthStore();
  useEffect(() => {
    onStartSheckAuthToken();
  }, []);

  if (status === "checking") {
    return "CARGANDO"
  }
  return (
    <Routes>
      {status === "authenticated" ? (
        <>
          <Route path="/*" element={<MainPage />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRouter />} />
          <Route path="/*" element={<Navigate to={"/auth/login"} />} />
        </>
      )}
      <Route path="/*" element={<Navigate to={"/auth/login"} />} />
    </Routes>
  );
};
