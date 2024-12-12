import styled from 'styled-components'

import { useTableColumnStores, useTableRowStores, useTableScope } from '../../models'
import { Switch } from '../Components/Switch'

const StyledTr = styled.tr`
  display: flex;
  flex-direction: row;

  justify-content: space-evenly;
  align-items: center;

  height: 3rem;

  color: var(--TableColorText);

  border: 1px solid var(--TableBorderColor, rgba(0, 0, 0, 0.06));

  font-size: 14px;
`

const StyledColumnCell = styled.td`
  display: flex;

  min-width: 0;
  width: 100%;

  flex-grow: 1;
  padding: 0 0.5rem;

  user-select: none;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TableBody = () => {
  const { table } = useTableScope()

  const { columns } = useTableColumnStores((state) => {
    return {
      columns: state.columns,
    }
  }, table)

  const { visibleRows } = useTableRowStores((state) => {
    return {
      visibleRows: state.visibleRows,
    }
  }, table)

  return (
    <tbody>
      {visibleRows.map((row, index) => {
        return (
          <StyledTr className="pretendard-400" key={row.id}>
            {columns.map((column) => {
              const style = column.width ? { width: column.width, flexGrow: 0, flexShrink: 0 } : {}

              return (
                <Switch
                  key={column.key}
                  value={!!column.customBodyCell}
                  caseBy={{
                    true: (
                      <StyledColumnCell style={style} key={column.key}>
                        {column.customBodyCell?.(row)}
                      </StyledColumnCell>
                    ),
                    false: (
                      <StyledColumnCell style={style} key={column.key}>
                        {row.record[column.key]}
                      </StyledColumnCell>
                    ),
                  }}
                />
              )
            })}
          </StyledTr>
        )
      })}
    </tbody>
  )
}

export default TableBody
