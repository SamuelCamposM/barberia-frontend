export const required = (value: string | string[] | number ) => {
  if (typeof value === "string" && value.trim() === "") {
    console.log({ value });
    return `El campo es obligatorio`;
  }
  if (typeof value === "object" && value.length === 0) {
    console.log({ value });
    return `El campo es obligatorio`;
  }
  return "";
};

export const validarEmail = (value: string | string[] | number ) => {
  if (
    typeof value === "string" &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
  ) {
    return "Invalid email format";
  }
  return "";
};
