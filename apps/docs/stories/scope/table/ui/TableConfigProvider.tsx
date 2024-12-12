'use client'

import { ComposeProviders, Scope } from '@lodado/react-namespace'
import { PropsWithChildren, ReactNode, useMemo } from 'react'

import {
  ColumnPresenter,
  FilterPresenter,
  RowPresenter,
  TableColumnProvider,
  TableFilterProvider,
  TableRowProvider,
  TableUsecase,
  TableUsecaseProvider,
} from '../models'
import { TableColumn, TableRow } from '../models/entities'

interface TableConfigProviderProps extends PropsWithChildren {
  initRows: TableRow[]
  initColumns: TableColumn[]
  children?: ReactNode
  scope: Scope<any>
}

const TableConfigProvider = ({ scope, initRows = [], initColumns = [], children }: TableConfigProviderProps) => {
  const rowPresenter = useMemo(() => {
    return new RowPresenter({
      rows: [],
    })
  }, [initRows])

  const columnPresenter = useMemo(() => {
    return new ColumnPresenter({
      columns: initColumns,
    })
  }, [initRows])

  const filterPresenter = useMemo(() => {
    return new FilterPresenter()
  }, [])

  const tableUsecase = useMemo(() => {
    return new TableUsecase({
      ColumnPresenter: columnPresenter,
      FilterPresenter: filterPresenter,
      RowPresenter: rowPresenter,
    })
  }, [columnPresenter, filterPresenter, rowPresenter])

  return (
    <ComposeProviders
      providers={[
        <TableUsecaseProvider scope={scope} overwriteStore={() => tableUsecase} />,
        <TableColumnProvider scope={scope} overwriteStore={() => columnPresenter} />,
        <TableRowProvider scope={scope} overwriteStore={() => rowPresenter} />,
        <TableFilterProvider scope={scope} overwriteStore={() => filterPresenter} />,
      ]}
    >
      {children}
    </ComposeProviders>
  )
}

export default TableConfigProvider
