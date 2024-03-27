import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const usePath = () => {
  const location = useLocation();
  const path = useMemo(() => location.pathname.split("/")[1], [location.pathname]);
  return path;
};
