import { formatUTCDate } from "@/shared";

import { RowDataType, TableColumn } from "../../models/entities";

export const FilterRenderer = ({ label, column }: { label: RowDataType; column: TableColumn }) => {
  switch (column.type) {
    case "date": {
      const dateFormat = formatUTCDate(new Date(Number(label)));
      return <>{dateFormat}</>;
    }
    case "checkbox":
      return <>{label ? "선택됨" : "선택 안됨"}</>;
    case "select":
    case "text":
    case "textArea":
    default:
      if (label == undefined) {
        return <> - </>;
      }

      return <>{label}</>;
  }
};
