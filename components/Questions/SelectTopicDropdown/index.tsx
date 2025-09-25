import React, { useMemo } from "react"
import { useQuery } from '@tanstack/react-query'
import { Dropdown, DropdownItemType } from "@/components/common/Dropdown"
import { PrimaryButton } from "@/components/common/Button"

// The API returns { topics: string[] }
type Props = {
  onTopicSelected: (topic: string) => void
  label?: string
}

export const SelectTopicDropdown: React.FC<Props> = ({ onTopicSelected, label }) => {
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

  const text = useMemo(() => {
    if (isLoading) {
      return "Loading..."
    }

    if (isError) {
      return "Retry"
    }
    return label || "Filter by topic"
  }, [isLoading, isError, label])

  return (
    <Dropdown items={items}>
      <PrimaryButton>
        {text}
      </PrimaryButton>
    </Dropdown>
  )
}

