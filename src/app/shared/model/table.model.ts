// modal.ts

export interface TableModel {
  params: TableParams;
}

export interface TableParams {
  fields: Field[][];
  rowsPerPage: number;
  tableElementsId: { [key: string]: string };
}

export interface Field {
  columnWidth: string;
  dbFieldSave: number;
  fieldType: string;
  colName: string;
  elements?: TableElement[];
}

export interface TableElement {
  elementType: string;
  css?: string;
  buttonTitle?: string;
  actions: Action[];
  executeCriterias?: ExecuteCriteria[];
}

export interface Action {
  actiontype: string;
  encrVar: string;
  params: { [key: string]: string | number } | any[];
  tmpalt: string;
  selectedParams: any[];
}

export interface ExecuteCriteria {
  data: string;
  crit: string;
  crit1: string;
}
