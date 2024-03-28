export interface DeptoItem {
  name: string;
  _id?: string;
}
export interface DeptoState {
  cargando: boolean;
  openRow: boolean;
  rowDefault: DeptoItem;
  rows: DeptoItem[];
}
