import type { NextPage } from 'next'
import { useState } from 'react'
import CheckboxAction from '../upload/CheckboxAction'
import RecentCredentialRow from './RecentCredentialRow'
import ViewAllButton from './ViewAllButton'

type RecentCredentialsTableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows?: any[]
  isSelectable?: boolean
  onSelectionChange?: (selectedRows: { [key: string]: boolean }) => void
}

const RecentCredentialsTable: NextPage<RecentCredentialsTableProps> = ({
  rows = [],
  isSelectable,
  onSelectionChange
}) => {
  const [allSelected, setAllSelected] = useState(false)
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  )

  const handleRowSelect = (isSelected: boolean, id: string) => {
    setSelectedRows((prevSelected) => {
      const newSelected = { ...prevSelected, [id]: isSelected }
      onSelectionChange?.(newSelected) // Call the callback with the new selection state
      return newSelected
    })
  }

  const handleSelectAll = () => {
    const newAllSelected = !allSelected
    setAllSelected(newAllSelected)

    const newSelectedRows = {}
    rows.forEach(
      (row) => (newSelectedRows[row.uploadedDataDetail.id] = newAllSelected)
    )
    setSelectedRows(newSelectedRows)
    onSelectionChange?.(newSelectedRows) // Call the callback with the new selection state
  }

  return (
    <div className='self-stretch rounded-mini bg-black-1 box-border overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] min-w-[500px] text-left text-xs text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4'>
      <div className='self-stretch h-14 flex flex-row items-center justify-start py-0 pr-0 pl-6 box-border gap-[20px] text-left text-3xl text-white-0 font-kumbh-sans'>
        <div className='self-stretch flex-1 flex flex-row items-center justify-start Small_Tablet:flex'>
          <h1 className='m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex'>
            Recent credentials
          </h1>
        </div>
        <ViewAllButton gotoPage='/credentials' />
      </div>
      <div className='self-stretch rounded-mini bg-black-2 h-14 flex flex-row items-center justify-start py-0 px-6 box-border text-left text-xs text-grey-1 font-kumbh-sans'>
        {isSelectable && (
          <CheckboxAction
            boxSizing='border-box'
            isChecked={allSelected}
            handleCheckboxChange={handleSelectAll}
          />
        )}
        <div className='flex-1 h-6 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border'>
          <div className='relative font-semibold'>Credential Type</div>
        </div>
        <div className='w-[200px] flex flex-row items-center justify-end gap-[30px] Small_Tablet:flex'>
          <div className='relative font-semibold inline-block w-[98px] shrink-0'>
            Credential Value
          </div>
          <div className='relative font-semibold inline-block w-[98px] shrink-0'>
            Transaction Amount
          </div>
        </div>
      </div>
      {rows.map((row) => (
        <RecentCredentialRow
          key={row.uploadedDataDetail.id}
          id={row.uploadedDataDetail.id}
          credentialDetail={row}
          isSelectable={isSelectable}
          onSelect={(isSelected) =>
            handleRowSelect(isSelected, row.uploadedDataDetail.id)
          }
          isChecked={selectedRows[row.uploadedDataDetail.id] || false}
        />
      ))}
    </div>
  )
}

export default RecentCredentialsTable
