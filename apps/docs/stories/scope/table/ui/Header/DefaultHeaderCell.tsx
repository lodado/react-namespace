import { useState } from 'react'
import styled from 'styled-components'

import { useTableScope } from '../../models'
import { TableColumn } from '../../models/entities'
import { Switch } from '../Components/Switch'

const StyledColumnCellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 1.375rem;

  padding: 0 0.5rem;

  border-left: 1px solid var(--TableBorderColor, rgba(0, 0, 0, 0.06));
  // border-right: 1px solid var(--TableBorderColor, rgba(0, 0, 0, 0.06));

  & svg {
    width: 0.5625rem;
    height: 0.5625rem;

    color: var(--TableColorTextDisabled, rgba(0, 0, 0, 0.25));
  }
`

const StyledButton = styled.button`
  border: none;
  background: none;

  &:hover {
    cursor: pointer;
  }
`

const StyledItem = styled.div`
  display: flex;
  min-width: 4rem;
  min-height: 1.375rem;

  padding: 0.3125rem 0.75rem;

  align-items: center;

  gap: 0.5rem;

  &[data-checked='true'] {
    background-color: var(--TransferControlItemBgActive, rgba(240, 247, 255, 1));
  }
`

const DefaultHeaderCell = ({ column }: { column: TableColumn }) => {
  return (
    <StyledColumnCellContainer>
      {column.label}

      <Switch
        key={column.key}
        value={!!column.customHeaderCell}
        caseBy={{
          true: <>{column.customHeaderCell?.(column)}</>,
          false: <></>,
        }}
      />
    </StyledColumnCellContainer>
  )
}

export default DefaultHeaderCell
