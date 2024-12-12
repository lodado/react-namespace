import { NamespaceStore } from "@lodado/namespace-core";

import { TableColumn } from "../entities";

export interface ColumnParams {
  columns: TableColumn[];
}

export default class ColumnPresenter extends NamespaceStore<ColumnParams> {
  constructor({ columns }: ColumnParams) {
    super({
      columns,
    });
  }
}
