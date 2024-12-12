import { RowDataType, TableRow } from '../entities'
import { ColumnPresenter, FilterPresenter, RowPresenter } from '../presenter'
import TableUsecase from './TableUsecase'

describe('TableUsecase', () => {
  const createMockRow = (id: string, record: Record<string, RowDataType>): TableRow => {
    return { id, record }
  }

  let rowPresenter: RowPresenter
  let tableUsecase: TableUsecase
  let filterPresenter: FilterPresenter

  beforeEach(() => {
    rowPresenter = new RowPresenter({ rows: [] })
    filterPresenter = new FilterPresenter()

    tableUsecase = new TableUsecase({
      ColumnPresenter: new ColumnPresenter({
        columns: [
          { key: 'key1', label: 'key1', type: 'text', required: true },
          { key: 'key2', label: 'key2', type: 'text', required: true },
        ],
      }),
      FilterPresenter: filterPresenter,
      RowPresenter: rowPresenter,
    })
  })

  describe('handleCreateRow', () => {
    describe('when a new row is created', () => {
      it('should add the row to originalRows', () => {
        const newRow = createMockRow('1', { key1: 'value1', key2: 123 })

        tableUsecase.handleCreateRow(newRow)

        expect(rowPresenter.originalRows).toEqual([newRow])
        expect(rowPresenter.state.visibleRows).toEqual([newRow])
      })
    })
  })

  describe('handleReadRows', () => {
    describe('when rows are read', () => {
      it('should return the current originalRows', () => {
        const row1 = createMockRow('1', { key1: 'value1' })
        const row2 = createMockRow('2', { key2: 456 })

        tableUsecase.handleCreateRow(row1)
        tableUsecase.handleCreateRow(row2)

        const { originalRows } = rowPresenter

        expect(originalRows).toEqual([row1, row2])
        expect(rowPresenter.state.visibleRows).toEqual([row1, row2])
      })
    })
  })

  describe('handleUpdateRow', () => {
    describe('when a row is updated', () => {
      it('should update the row in originalRows', () => {
        const existingRow = createMockRow('1', { key1: 'value1' })
        const updatedRow = createMockRow('1', { key1: 'updated value' })

        rowPresenter.appendRow(existingRow)
        tableUsecase.handleUpdateRow(updatedRow)

        expect(rowPresenter.originalRows).toEqual([updatedRow])
        expect(rowPresenter.state.visibleRows).toEqual([updatedRow])
      })
    })
  })

  describe('handleDeleteRow', () => {
    describe('when a row is deleted', () => {
      it('should remove the row from originalRows', () => {
        const row1 = createMockRow('1', { key1: 'value1' })
        const row2 = createMockRow('2', { key2: 456 })

        rowPresenter.appendRow(row1)
        rowPresenter.appendRow(row2)

        tableUsecase.handleDeleteRow(row1)

        expect(rowPresenter.originalRows).toEqual([row2])
        expect(rowPresenter.state.visibleRows).toEqual([row2])
      })
    })

    it('should remove the row from originalRows after update (bugfix patch)', () => {
      const row1 = createMockRow('1', { key1: 'value1' })
      const row2 = createMockRow('2', { key2: 456 })

      rowPresenter.appendRow(row1)
      rowPresenter.appendRow(row2)

      const row1Updated = createMockRow('1', { key1: 'updated value' })

      tableUsecase.handleUpdateRow(row1Updated)

      tableUsecase.handleDeleteRow(row1Updated)

      expect(rowPresenter.originalRows).toEqual([row2])
      expect(rowPresenter.state.visibleRows).toEqual([row2])
    })
  })

  describe('Filter', () => {
    describe('when a row is filtered', () => {
      it('should remove the row from visibleRows', () => {
        const row1 = createMockRow('1', { key1: 'value1' })
        const row2 = createMockRow('2', { key2: 456 })
        const row3 = createMockRow('3', { key1: 'test', key2: 4567 })

        rowPresenter.appendRow(row1)
        rowPresenter.appendRow(row2)
        rowPresenter.appendRow(row3)

        tableUsecase.handleToggleRow('key2', 456)

        expect(rowPresenter.originalRows).toEqual([row1, row2, row3])
        expect(rowPresenter.state.visibleRows).toEqual([row1, row3])
      })
    })
  })

  it('should remove the row from visibleRows', () => {
    const row1 = createMockRow('1', { key1: 'value1' })
    const row2 = createMockRow('2', { key2: 456 })
    const row3 = createMockRow('3', { key1: 'test', key2: 456 })

    rowPresenter.appendRow(row1)
    rowPresenter.appendRow(row2)
    rowPresenter.appendRow(row3)

    tableUsecase.handleToggleRow('key2', 456)

    expect(rowPresenter.originalRows).toEqual([row1, row2, row3])
    expect(rowPresenter.state.visibleRows).toEqual([row1])
  })

  describe('updateDataSets (indirectly tested through public methods)', () => {
    describe('when rows are created or modified', () => {
      it('should generate datasets for each column based on the rows and update FilterPresenter', () => {
        // Arrange
        const row1 = createMockRow('1', { key1: 'value1', key2: 123 })
        const row2 = createMockRow('2', { key1: 'value2', key2: 456 })
        const row3 = createMockRow('3', { key1: 'value1', key2: 789 })

        // Act
        tableUsecase.handleCreateRow(row1)
        tableUsecase.handleCreateRow(row2)
        tableUsecase.handleCreateRow(row3)

        // Assert
        const expectedDataSets = {
          key1: new Set(['value1', 'value2']),
          key2: new Set([123, 456, 789]),
        }

        expect(filterPresenter.state.dataSets).toEqual(expectedDataSets)
      })
    })

    describe('as is - when some values are undefined', () => {
      it('should generate datasets for each column based on the rows, including undefined values, and update FilterPresenter', () => {
        // Arrange
        const row1 = createMockRow('1', { key1: 'value1', key2: 123 })
        const row2 = createMockRow('2', { key1: undefined, key2: 456 })
        const row3 = createMockRow('3', { key1: 'value1', key2: undefined })

        // Act
        tableUsecase.handleCreateRow(row1)
        tableUsecase.handleCreateRow(row2)
        tableUsecase.handleCreateRow(row3)

        tableUsecase.handleToggleRow('key2', undefined)
        tableUsecase.handleToggleRow('key1', undefined)

        // Assert
        const expectedDataSets = {
          key1: new Set(['value1', undefined]),
          key2: new Set([123, 456, undefined]),
        }

        expect(filterPresenter.state.dataSets).toEqual(expectedDataSets)
        expect(rowPresenter.originalRows).toEqual([row1, row2, row3])
        expect(rowPresenter.state.visibleRows).toEqual([row1])
      })
    })

    describe('when rows are cleared', () => {
      it('should reset datasets to empty for all columns', () => {
        // Arrange
        const row1 = createMockRow('1', { key1: 'value1', key2: 123 })
        const row2 = createMockRow('2', { key1: 'value2', key2: 456 })

        tableUsecase.handleCreateRow(row1)
        tableUsecase.handleCreateRow(row2)

        // Act
        tableUsecase.handleClearRows()

        // Assert
        const expectedDataSets = {
          key1: new Set(),
          key2: new Set(),
        }

        expect(filterPresenter.state.dataSets).toEqual(expectedDataSets)
      })
    })
  })
})
