import { Scope } from '@lodado/react-namespace'
import { useRef } from 'react'
import styled from 'styled-components'

import { TableScopeProvider } from '../models'
import TableBody from './Body/TableBody'
import TableHeader from './Header/TableHeader'

const StyledTable = styled.table`
  width: 100%;
  height: 100%;
`

const VirtualStyledContainer = styled.div`
  height: 100vh;

  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;

  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Wrapper = styled.div`
  height: 250px;
  padding: 20px;

  overflow: hidden;
`

const Table = ({ scope, className }: { scope: Scope<any>; className?: string }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  return (
    <TableScopeProvider value={{ table: scope }}>
      <Wrapper>
        <VirtualStyledContainer className={className} ref={parentRef}>
          <StyledTable>
            <TableHeader />
            <TableBody />
          </StyledTable>
        </VirtualStyledContainer>
      </Wrapper>
    </TableScopeProvider>
  )
}

export default Table
