export interface Crud {
  editado?: boolean;
  eliminado?: boolean;
  nuevo?: boolean;
}

export interface Action {
  icon: JSX.Element;
  name: string;
  badge?: string;
  disabled?: boolean;
  ocultar?: boolean;
  onClick: (arg: any) => void;
  bgColor?: "primary" | "secondary" | "tertiary" | "error" | "success";
}
