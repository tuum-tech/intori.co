import { NextPage } from 'next'

const DateFormatter: NextPage<{ dateStr: string }> = ({ dateStr }) => {
  const date = new Date(dateStr)
  const formattedDate = `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1
  ).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`

  return <span>{formattedDate}</span>
}

export default DateFormatter
