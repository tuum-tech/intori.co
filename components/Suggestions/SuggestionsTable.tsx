import React from 'react'
import { SuggestionType } from '../../models/userAnswers'
import { SuggestionRow } from './SuggestionRow'
import { Skeleton } from '../../components/common/Skeleton'
import styles from './Suggestions.module.css'

type Props = {
  suggestions: SuggestionType[]
}

export const LoadingSuggestionsTable: React.FC = () => {
  return (
    <table className={styles.suggestionsTable}>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(10)].map((_, index) => (
          <tr key={index}>
            <td>
              <span
                className={styles.avatar}
                style={{ backgroundColor: 'grey' }}
              />
            </td>

            <td>
              <Skeleton width={100 + Math.floor(Math.random() * 41) - 20} />
            </td>

            <td>
              <Skeleton width={50 + Math.floor(Math.random() * 41) - 20} />
            </td>

            <td>
              <Skeleton width={350 + Math.floor(Math.random() * 41) - 20} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const SuggestionsTable: React.FC<Props> = ({ suggestions }) => {
  return (
    <table className={styles.suggestionsTable}>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Reason</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {suggestions.map((suggestion, index) => (
          <SuggestionRow
            key={suggestion.user?.fid || index}
            suggestion={suggestion}
          />
        ))}
      </tbody>
    </table>
  )
}

