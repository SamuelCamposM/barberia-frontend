import { ChangeEvent, useCallback, useMemo, useState } from "react";

export const useForm = <
  ValueTypes extends Record<string, string | string[] | number>,
  ConfigTypes extends Record<
    string,
    ((value: string | string[] | number, allValues: ValueTypes) => string)[]
  >
>(
  InitialValues: ValueTypes,
  ObjectValidations: ConfigTypes
) => {
  const [cargandoSubmit, setCargandoSubmit] = useState<boolean>(false);
  const [formValues, setformValues] = useState(InitialValues);
  const [isFormInvalid, setisFormInvalid] = useState(false);
  const [isSubmited, setisSubmited] = useState(false);
  const [onBlur, setonBlur] = useState(0);

  const errorValues = useMemo<Record<keyof ConfigTypes, string[]>>(() => {
    const entries = Object.entries(ObjectValidations);
    let hayError = false;
    const res = entries.map(([name]) => {
      const errores = ObjectValidations[name]
        .map((validation) => {
          const result = validation(formValues[name], formValues);

          if (result) {
            hayError = true;
          }
          return result;
        })
        .filter((err) => err !== "");
      setisFormInvalid(hayError);

      return [name, isSubmited ? errores : []];
    });

    return Object.fromEntries(res);
  }, [onBlur, isSubmited]);

  const isFormInvalidSubmit = useCallback((formValues: ValueTypes) => {
    const entries = Object.entries(ObjectValidations);
    const res = entries.some(([name]) => {
      return ObjectValidations[name].some((validation) => {
        const result = validation(formValues[name], formValues);
        return result !== "";
      });
    });
    return res;
  }, []);

  const onResetForm = useCallback(() => {
    setCargandoSubmit(false);
    setformValues(InitialValues);
    setisSubmited(false);
    setonBlur(0);
  }, []);

  const onNewForm = useCallback((newValues: ValueTypes) => {
    setCargandoSubmit(false);
    setformValues(newValues);
    setisSubmited(false);
    setonBlur(0);
  }, []);

  const handleBlur = useCallback(() => {
    setonBlur((prev) => prev + 1);
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setformValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  return {
    cargandoSubmit,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    isFormInvalid,
    isFormInvalidSubmit,
    onNewForm,
    onResetForm,
    setCargandoSubmit,
    setformValues,
    setisSubmited,
  };
};
