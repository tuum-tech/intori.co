import _ from 'lodash'
import { NextPage } from 'next'
import { useState } from 'react'
import CredRow from '../credentials/CredRow'
import CheckboxAction from '../upload/CheckboxAction'
import UploadedDataRow from '../upload/UploadedDataRow'

type SelectedRows = {
  [key: string]: boolean // or any other type that `newAllSelected` is
}

type DataTableProps = {
  title: string
  titleContainers?: JSX.Element[]
  isCredentialType?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows?: any[]
  isSelectable?: boolean
  onSelectionChange?: (selectedRows: { [key: string]: boolean }) => void
}

const DataTable: NextPage<DataTableProps> = ({
  title,
  titleContainers,
  isCredentialType,
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

    const newSelectedRows: SelectedRows = {}
    // If we are selecting all, set the state for each row to true, otherwise to false.
    rows.forEach((row) => {
      if (row.uploadedDataDetail && isCredentialType) {
        newSelectedRows[row.uploadedDataDetail.id] = newAllSelected
      } else {
        newSelectedRows[row.id] = newAllSelected
      }
    })

    setSelectedRows(newSelectedRows)
    onSelectionChange?.(newSelectedRows) // Call the callback with the new selection state
  }

  return (
    <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4 Small_Tablet:hidden'>
      <div className='self-stretch h-14 flex flex-row items-center justify-start py-0 pr-0 pl-6 box-border gap-[20px] text-left text-xs text-white-1 font-kumbh-sans'>
        <div className='self-stretch flex-1 flex flex-row items-center justify-start text-left text-3xl text-white-0 font-kumbh-sans Small_Tablet:flex'>
          <h1 className='m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex'>
            {title}
          </h1>
        </div>
        {titleContainers}
      </div>
      <div className='self-stretch rounded-mini bg-black-2 flex flex-row items-center justify-start py-0 px-6 gap-[31px] text-left text-xs text-grey-1 font-kumbh-sans'>
        {isSelectable && (
          <CheckboxAction
            boxSizing='border-box'
            isChecked={allSelected}
            handleCheckboxChange={handleSelectAll}
          />
        )}

        <div className='flex-1 h-6 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border'>
          <div className='relative font-semibold'>
            {isCredentialType ? 'Credential' : 'Data'} Type
          </div>
        </div>
        <div className='w-[400px] flex flex-row items-center justify-between Small_Tablet:flex'>
          <div className='relative font-semibold inline-block w-[90px] shrink-0'>
            Credential Value
          </div>
          <div className='relative font-semibold inline-block w-[90px] shrink-0'>
            Transaction Amount
          </div>
          <div className='relative font-semibold inline-block w-[90px] shrink-0'>
            {isCredentialType ? 'Issued' : 'Purchased'}
          </div>
          <div className='relative font-semibold inline-block w-[90px] shrink-0'>
            {isCredentialType ? 'Expire' : 'Uploaded'}
          </div>
          <div className='rounded-mini' />;
        </div>
      </div>

      <div className='self-stretch flex flex-col items-start justify-start gap-[15px] text-center text-xs text-white-0 font-kumbh-sans'>
        {rows.map((row) => {
          // Check for null or undefined row
          if (!row) return null

          // Check if the row has the necessary properties
          const hasVCredMetadata =
            'vCredMetadata' in row &&
            !_.isNull(row.vCredMetadata) &&
            !_.isEmpty(row.vCredMetadata)
          const hasUploadedDataDetail =
            'uploadedDataDetail' in row &&
            !_.isNull(row.uploadedDataDetail) &&
            !_.isEmpty(row.uploadedDataDetail)

          const hasId = 'id' in row && !_.isEmpty(row.id)
          const hasOrderData =
            'orderData' in row &&
            !_.isNull(row.orderData) &&
            !_.isEmpty(row.orderData)

          // Conditionally render components based on the presence of properties and isCredentialType
          return isCredentialType ? (
            hasVCredMetadata && hasUploadedDataDetail ? (
              <CredRow
                key={row.uploadedDataDetail.id}
                id={row.uploadedDataDetail.id}
                credentialDetail={row}
                isSelectable={isSelectable}
                onSelect={(isSelected) =>
                  handleRowSelect(isSelected, row.uploadedDataDetail.id)
                }
                isChecked={selectedRows[row.uploadedDataDetail.id] || false}
              />
            ) : null
          ) : hasId && hasOrderData ? (
            <UploadedDataRow
              key={row.id}
              orderData={row.orderData}
              isSelectable={isSelectable}
              onSelect={(isSelected) => handleRowSelect(isSelected, row.id)}
              isChecked={selectedRows[row.id] || false}
            />
          ) : null
        })}
      </div>
    </div>
  )
}

export default DataTable
