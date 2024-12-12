import { NamespaceStore } from '@lodado/namespace-core'

import { RowDataType, TableRow } from '../entities'
import { ColumnPresenter, FilterPresenter, RowPresenter } from '../presenter'

interface TableUsecaseParams {
  ColumnPresenter: ColumnPresenter
  FilterPresenter: FilterPresenter
  RowPresenter: RowPresenter
}

export default class TableUsecase extends NamespaceStore<{}> {
  ColumnPresenter: ColumnPresenter
  FilterPresenter: FilterPresenter
  RowPresenter: RowPresenter

  constructor({
    ColumnPresenter: columnPresenter,
    RowPresenter: rowPresenter,
    FilterPresenter: filterPresenter,
  }: TableUsecaseParams) {
    super({
      visibleRows: [],
    })

    this.ColumnPresenter = columnPresenter
    this.RowPresenter = rowPresenter
    this.FilterPresenter = filterPresenter

    this.updateDataSets()
  }

  protected async saveRowInformation() {
    const rows = this.RowPresenter.originalRows
  }

  protected updateDataSets() {
    const rows = this.RowPresenter.originalRows
    const { columns } = this.ColumnPresenter.state

    const newDataSets: Record<string, Set<RowDataType>> = {}

    columns.forEach((column) => {
      const dataSet = new Set<RowDataType>()

      rows.forEach((row) => {
        dataSet.add(row.record[column.key])
      })

      newDataSets[column.key] = dataSet
    })

    this.FilterPresenter.updateDataSets(newDataSets)
  }

  handleCreateRow(row: TableRow) {
    this.RowPresenter.appendRow(row)

    this.commit()
  }

  handleUpdateRow(row: TableRow) {
    this.RowPresenter.updateRow(row)

    this.commit()
  }

  handleDeleteRow(row: TableRow) {
    this.RowPresenter.deleteRow(row)

    this.commit()
  }

  handleClearRows() {
    this.RowPresenter.clearRows()

    this.commit()
  }

  handleToggleRow(key: string, value: RowDataType) {
    this.FilterPresenter.toggleFilter(key, value)

    this.commit()
  }

  commit() {
    const rows = this.RowPresenter.originalRows
    const { columns } = this.ColumnPresenter.state

    const visibleRows = rows.filter((row) => {
      return columns.every(({ key }) => {
        const value = row.record[key]

        if (this.FilterPresenter.isFiltered(key, value)) {
          return false
        }

        return true
      })
    })

    this.RowPresenter.updateVisibieRows(visibleRows)
    this.updateDataSets()
    this.saveRowInformation()
  }
}
