import { createContext } from "react";
import { useAuthStore, useChatStore, useSocket } from "../hooks";
import { Socket } from "socket.io-client";
import { getEnvVariables, EnvVariables } from "../helpers";
import { useEffect } from "react";
import { Mensaje } from "../store/interfaces";

export const SocketContext = createContext({
  socket: null as Socket | null,
  online: false,
});

const { VITE_API_URL } = getEnvVariables() as EnvVariables;

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(VITE_API_URL);
  const { status } = useAuthStore();

  const { onCargarUsuarios, onAddMessage } = useChatStore();
  useEffect(() => {
    if (status === "authenticated") {
      conectarSocket();
    }
  }, [status]);

  useEffect(() => {
    if (status === "not-authenticated") {
      desconectarSocket();
    }
  }, [status]);

  useEffect(() => {
    socket?.on("lista-usuarios", (data) => {
      onCargarUsuarios(data);
    });
  }, [socket]);
  useEffect(() => {
    socket?.on("mensaje-personal", (mensaje: Mensaje) => {
      onAddMessage(mensaje);
    });
  }, [socket]);
  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
