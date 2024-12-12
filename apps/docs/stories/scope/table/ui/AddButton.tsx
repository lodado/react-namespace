import { Scope } from '@lodado/react-namespace'

import { useTableScope, useTableUsecaseActions } from '../models'
import { createRandomRecord } from '../utils/createRandomRecords'

let autoIncrement = 0

const AddButton = ({ scope }: { scope: Scope<any> }) => {
  const { handleCreateRow } = useTableUsecaseActions(scope)

  const handleAddRow = () => {
    autoIncrement += 1
    handleCreateRow({ id: `${Date.now()}-${autoIncrement}`, record: createRandomRecord() })
  }

  return (
    <button type="button" onClick={handleAddRow}>
      generateRandomRecord
    </button>
  )
}

export default AddButton
