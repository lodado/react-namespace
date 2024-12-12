import styled from 'styled-components'

import { TableColumn } from '../models/entities'

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`

export const COLUMN_KEY_CHECK = 'CHECK'
export const COLUMN_KEY_NAME = 'NAME'
export const COLUMN_KEY_ADDRESS = 'ADDRESS'
export const COLUMN_KEY_MEMO = 'MEMO'
export const COLUMN_KEY_REGISTER_DATE = 'REGISTER_DATE'
export const COLUMN_KEY_JOB = 'JOB'
export const COLUMN_KEY_EMAIL_AGREEMENT = 'EMAIL_AGREEMENT'
export const COLUMN_KEY_SETTINGS = 'SETTINGS'

export const assignmentColumns: TableColumn[] = [
  {
    key: COLUMN_KEY_NAME,
    label: 'id',
    type: 'text',
    required: true,
  },
  {
    key: COLUMN_KEY_ADDRESS,
    label: 'address',
    type: 'text',
    required: false,
  },
  {
    key: COLUMN_KEY_MEMO,
    label: 'memo',
    type: 'textArea',
    required: false,
  },
] as const
