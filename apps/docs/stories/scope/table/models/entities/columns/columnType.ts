/* eslint-disable no-use-before-define */
import { ReactNode } from 'react'

import { TableRow } from '../rows'

type BaseColumn = {
  key: string
  label: string
  required: boolean

  width?: string

  filter?: boolean

  customHeaderCell?: (column: TableColumn) => ReactNode
  customBodyCell?: (row: TableRow) => ReactNode
}

type SelectColumn = BaseColumn & {
  type: 'select'
  options: string[] // 반드시 필요
}

type OtherColumn = BaseColumn & {
  type: 'text' | 'textArea' | 'date' | 'checkbox' | 'custom'
  options?: never // 허용하지 않음
}

export type Column = SelectColumn | OtherColumn

export type TableColumn = Column
