import { KeyboardEvent } from "react";

export const required = (value: string | string[] | number) => {
  if (typeof value === "string" && value.trim() === "") {
    return `El campo es obligatorio`;
  }
  if (typeof value === "object" && value.length === 0) {
    return `El campo es obligatorio`;
  }
  return "";
};

export const validarEmail = (value: string | string[] | number) => {
  if (
    typeof value === "string" &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
  ) {
    return "Invalid email format";
  }
  return "";
};

export const validateFunction = (e: KeyboardEvent) =>
  isNaN(Number(e.key)) || !e.altKey ? true : false;
