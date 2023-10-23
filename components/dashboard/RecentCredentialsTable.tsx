import type { NextPage } from 'next'
import { useState } from 'react'
import CheckboxAction from '../upload/CheckboxAction'
import RecentCredentialRow from './RecentCredentialRow'
import ViewAllButton from './ViewAllButton'

type RecentCredentialsTableProps = {
  rows?: any[]
  isSelectable?: boolean
}

const RecentCredentialsTable: NextPage<RecentCredentialsTableProps> = ({
  rows = [],
  isSelectable
}) => {
  const [allSelected, setAllSelected] = useState(false)
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {}
  )

  const handleRowSelect = (isSelected: boolean, id: string) => {
    setSelectedRows((prevSelected) => ({ ...prevSelected, [id]: isSelected }))
  }

  const handleSelectAll = () => {
    const newAllSelected = !allSelected
    setAllSelected(newAllSelected)

    const newSelectedRows = {}
    rows.forEach((row) => (newSelectedRows[row.id] = newAllSelected))
    setSelectedRows(newSelectedRows)
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
        <div className='w-[195px] flex flex-row items-center justify-end gap-[24px] Small_Tablet:flex'>
          <div className='relative font-semibold inline-block w-[70px] shrink-0'>
            Value
          </div>
        </div>
      </div>
      {rows.map((row) => (
        <RecentCredentialRow
          key={row.id}
          id={row.id}
          verifiableCredential={row.verifiableCredential}
          isSelectable={isSelectable}
          onSelect={(isSelected) => handleRowSelect(isSelected, row.id)}
          isChecked={selectedRows[row.id] || false}
        />
      ))}
    </div>
  )
}

export default RecentCredentialsTable
