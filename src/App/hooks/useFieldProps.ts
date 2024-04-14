import { useCallback } from "react";

export type KeyboardEvent = React.KeyboardEvent;

export const useFieldProps = <
  Config extends Record<string, ((...args: any[]) => any)[]>
>(
  config: Config,
  formValues: any,
  errorValues: any,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleBlur: () => void,
  handleKeyDown: (arg: KeyboardEvent) => void
) => {
  type Property = keyof Config;

  const getNestedObject = useCallback((nestedObj: any, pathArr: string[]) => {
    return pathArr.reduce(
      (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
      nestedObj
    );
  }, []);

  const defaultPropsGenerator = useCallback(
    (property?: Property, isRequired = false, hasValue = false) => {
      let baseProps: {
        fullWidth: boolean;
        onKeyDown: (e: KeyboardEvent) => void;
        autoComplete: string;
        name?: Property;
        onBlur: () => void;
        value?: any;
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
        error?: boolean;
        helperText?: string;
      } = {
        fullWidth: true,
        onKeyDown: handleKeyDown,
        autoComplete: "false",
        onBlur: handleBlur,
        name: property,
      };

      if (isRequired) {
        baseProps = {
          ...baseProps,
          error: errorValues[property!].length > 0,
          helperText: errorValues[property!].join(" - "),
        };
      }
      if (hasValue) {
        const values = String(property)?.split(".");
        baseProps = {
          ...baseProps,
          value: getNestedObject(formValues, values!),
          onChange: handleChange,
        };
      }

      return baseProps;
    },
    [config, formValues, errorValues, handleChange, handleBlur, getNestedObject]
  );

  return { defaultPropsGenerator };
};
