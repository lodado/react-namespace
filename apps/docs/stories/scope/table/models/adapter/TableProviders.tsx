import { createNamespaceScope, createScopeContainer } from "@lodado/react-namespace";

import { ColumnPresenter, FilterPresenter, RowPresenter } from "../presenter";
import { TableUsecase } from "../usecase";

export const [createTableRowProvider, createTableRowScope] = createNamespaceScope("TableRow");

export const [createTableColumnProvider, createTableColumnScope] = createNamespaceScope("TableColumn");

export const [createTableFilterProvider, createTableFilterScope] = createNamespaceScope("TableFilter");

export const [createTableUsecaseProvider, createTableUsecaseScope] = createNamespaceScope("TableUsecase", [
  createTableRowScope,
  createTableColumnScope,
  createTableFilterScope,
]);

export const { Provider: TableRowProvider, useNamespaceStores: useTableRowStores } =
  createTableRowProvider<RowPresenter>("tableRow", {});

export const { Provider: TableColumnProvider, useNamespaceStores: useTableColumnStores } =
  createTableColumnProvider<ColumnPresenter>("tableColumn", {});

export const { Provider: TableFilterProvider, useNamespaceStores: useTableFilterStores } =
  createTableFilterProvider<FilterPresenter>("tableFilter", {});

export const {
  Provider: TableUsecaseProvider,
  useNamespaceAction: useTableUsecaseActions,
  useNamespaceStores: useTableUsecaseStores,
} = createTableUsecaseProvider<TableUsecase>("tableUsecase", {});

export const createTableScope = createTableUsecaseScope();

export const { ScopeContainerProvider: TableScopeProvider, useScopeContainer: useTableScope } =
  createScopeContainer<"table">();
