import React from 'react'
import { SuggestionType } from '../../models/userAnswers'
import { PrimaryButton } from '../../components/common/Button'
import styles from './Suggestions.module.css'

type Props = {
  suggestion: SuggestionType
}

export const SuggestionRow: React.FC<Props> = ({
  suggestion
}) => {
  const { user } = suggestion

  return (
      <tr>
        <td>
          { !!user.image && (
            <span
              className={styles.avatar}
              style={{ backgroundImage: `url(${user.image})` }}
            />
          )}
          { !user.image && (
            <span
              className={styles.avatar}
              style={{ backgroundColor: 'grey' }}
            />
          )}
        </td>
        <td className={styles.name}>
          <span>{user?.username}</span>
        </td>
        <td className={styles.type}>
          <span>User</span>
        </td>
        <td className={styles.reasons}>
          <ul>
            {
              suggestion.reason.map((reason) => (
                <li className={styles.reason} key={reason}>{reason}</li>
              ))
            }
          </ul>
        </td>
        <td>
          <a href={`https://warpcast.com/${user.username}`}>
            <PrimaryButton>
              View Profile
            </PrimaryButton>
          </a>
        </td>
      </tr>
  )
}

