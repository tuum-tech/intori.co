import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dropdown, DropdownItemType } from "@/components/common/Dropdown"
import { PrimaryButton } from "@/components/common/Button"

// The API returns { topics: string[] }
type Props = {
  onTopicSelected: (topic: string) => void
}

export const SelectTopicDropdown: React.FC<Props> = ({ onTopicSelected }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await fetch('/api/topics')
      if (!res.ok) throw new Error('Failed to fetch topics')
      return res.json() as Promise<{ topics: string[] }>
    },
    staleTime: 1000 * 60 * 10 // 10 minutes
  })

  const items: DropdownItemType[] = (data?.topics || []).map(topic => ({
    label: topic,
    // onClick: () => onTopicSelected(topic)
    onClick: () => onTopicSelected(topic)
  }))

  return (
    <Dropdown items={items}>
      <PrimaryButton>
        {isLoading ? 'Loading...' : isError ? 'Retry' : 'Filter by topic'}
      </PrimaryButton>
    </Dropdown>
  )
}

