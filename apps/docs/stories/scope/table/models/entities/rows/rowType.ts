export type RowDataType = undefined | string | number | boolean;

export type Row = {
  id: string;
  record: Record<string, RowDataType>;
};

export type TableRow = Row;