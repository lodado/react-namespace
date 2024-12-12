import styled from 'styled-components'

import { useTableColumnStores, useTableScope } from '../../models'
import DefaultHeaderCell from './DefaultHeaderCell'

const StickyTableHeader = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1;
`

const StyledTr = styled.tr`
  display: flex;
  flex-direction: row;

  justify-content: space-evenly;
  align-items: center;

  height: 2.375rem;
  border: 1px solid var(--TableBorderColor, rgba(0, 0, 0, 0.06));

  background-color: var(--TableColorFillAlter, rgba(0, 0, 0, 0.02));
  color: var(--TableColorText);

  font-size: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--backgroundForOpacity, #fff);
    z-index: -1;
  }
`

const StyledColumnCell = styled.td`
  display: flex;

  width: 100%;

  flex-grow: 1;

  user-select: none;
`

const TableHeader = () => {
  const { table } = useTableScope()

  const { columns } = useTableColumnStores((state) => {
    return {
      columns: state.columns,
    }
  }, table)

  return (
    <StickyTableHeader>
      <StyledTr className="pretendard-600">
        {columns.map((column) => {
          const style = column.width ? { width: column.width, flexGrow: 0, flexShrink: 0 } : {}

          return (
            <StyledColumnCell style={style} key={column.key}>
              <DefaultHeaderCell column={column} />
            </StyledColumnCell>
          )
        })}
      </StyledTr>
    </StickyTableHeader>
  )
}

export default TableHeader
