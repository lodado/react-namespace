import { NamespaceStore } from '@lodado/namespace-core'

import { TableRow } from '../entities'

export interface RowParams {
  visibleRows: TableRow[]
}

export default class ColumnPresenter extends NamespaceStore<RowParams> {
  originalRows: TableRow[]
  constructor({ rows }: { rows: TableRow[] }) {
    super({
      visibleRows: rows,
    })

    this.originalRows = rows
  }

  updateVisibieRows(newVisibleRows: TableRow[]) {
    this.state.visibleRows = newVisibleRows
  }

  appendRow(newRow: TableRow) {
    this.originalRows = [...this.originalRows, newRow]
  }

  updateRow(updatedRow: TableRow) {
    this.originalRows = this.originalRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
  }

  deleteRow(deletedRow: TableRow) {
    this.originalRows = this.originalRows.filter((row) => row.id !== deletedRow.id)
  }

  clearRows() {
    this.originalRows = []
  }
}
