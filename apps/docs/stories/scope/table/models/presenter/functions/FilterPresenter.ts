import { NamespaceStore } from "@lodado/namespace-core";

import { RowDataType } from "../../entities";

export interface FilterParams {
  filter: Record<string, Set<RowDataType>>;
  dataSets: Record<string, Set<RowDataType>>;
}

export default class FilterPresenter extends NamespaceStore<FilterParams> {
  constructor() {
    super({
      filter: {},
      dataSets: {},
    });
  }

  updateDataSets(newDataSets: Record<string, Set<RowDataType>>) {
    this.state.dataSets = newDataSets;
  }

  isFiltered(key: string, value: RowDataType) {
    return this.state.filter?.[key]?.has(value) ?? false;
  }

  toggleFilter(key: string, value: RowDataType) {
    const filterSet = new Set(this.state.filter?.[key] ?? []);

    if (filterSet.has(value)) {
      filterSet.delete(value);
    } else {
      filterSet.add(value);
    }

    this.state.filter = {
      ...this.state.filter,
      [key]: filterSet,
    };
  }
}
