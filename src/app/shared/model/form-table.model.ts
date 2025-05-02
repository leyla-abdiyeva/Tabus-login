export interface Field {
  columnWidth: string;
  fieldType: string | number;
  dbFieldSave: number;
  colName: string;
  elements?: ButtonElement[]; // for Action column
}

export interface ButtonElement {
  elementType: string;
  buttonTitle: string;
  actions: ButtonAction[];
}

export interface ButtonAction {
  actiontype: string;
  formId: string;
  encrVar: string | null;
  params: any;
  tmpalt?: string;
  selectedParams: string[];
}

export interface DataRow {
  [key: string]: any;
  uid: string;
  elementID: number;
}

export interface TableElementParams {
  fields: Field[][];
  rowsPerPage: number;
  dataSet: DataRow[];
}
