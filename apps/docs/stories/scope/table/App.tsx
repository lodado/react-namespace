'use client'

import { ComposeProviders } from '@lodado/react-namespace'
import styled from 'styled-components'

import { assignmentColumns } from './configs/columnMetadata'
import { createTableUsecaseScope, TableScopeProvider } from './models'
import { TableConfigProvider } from './ui'
import AddButton from './ui/AddButton'
import Table from './ui/Table'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  width: 100%;
`

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: repeat(2, auto);
  margin-bottom: 1rem;
`

const TableExample = () => {
  const tableScope1 = createTableUsecaseScope()({})
  const tableScope2 = createTableUsecaseScope()({})
  const tableScope3 = createTableUsecaseScope()({})
  const tableScope4 = createTableUsecaseScope()({})

  return (
    <ComposeProviders
      providers={[
        <TableConfigProvider scope={tableScope1.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
        <TableConfigProvider scope={tableScope2.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
        <TableConfigProvider scope={tableScope3.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
        <TableConfigProvider scope={tableScope4.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
        <TableScopeProvider value={{ table: tableScope1.__scopeTableUsecase }} />,
        <TableScopeProvider value={{ table: tableScope2.__scopeTableUsecase }} />,
        <TableScopeProvider value={{ table: tableScope3.__scopeTableUsecase }} />,
        <TableScopeProvider value={{ table: tableScope4.__scopeTableUsecase }} />,
      ]}
    >
      <main>
        <ButtonContainer>
          <div>
            Table 1 Scope. <AddButton scope={tableScope1.__scopeTableUsecase} />
          </div>
          <div>
            Table 2 Scope. <AddButton scope={tableScope2.__scopeTableUsecase} />
          </div>
          <div>
            Table 3 Scope. <AddButton scope={tableScope3.__scopeTableUsecase} />
          </div>
          <div>
            Table 4 Scope. <AddButton scope={tableScope4.__scopeTableUsecase} />
          </div>
        </ButtonContainer>

        <GridContainer>
          <Table scope={tableScope1.__scopeTableUsecase} />
          <Table scope={tableScope2.__scopeTableUsecase} />
          <Table scope={tableScope3.__scopeTableUsecase} />
          <Table scope={tableScope4.__scopeTableUsecase} />
        </GridContainer>
      </main>
    </ComposeProviders>
  )
}

export default TableExample
