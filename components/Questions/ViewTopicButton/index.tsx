import React, { useState } from 'react'
import styles from "./styles.module.css"
import { Modal, ModalFooter } from '@/components/common/Modal'
import { PrimaryButton, SecondaryButton } from '@/components/common/Button'
import { useMutation } from '@tanstack/react-query'

// API response type
// { questionAnswersThatUnlockTopic: { question: string, answer: string }[] }
type Props = {
  topic: string
  question: string
}

export const ViewTopicButton: React.FC<Props> = ({ topic, question }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<{ question: string, answer: string }[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const removeTopicMutation = useMutation({
    mutationFn: async ({ question, topic }: { question: string, topic: string }) => {
      const res = await fetch('/api/topics/remove-topic-from-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, topic })
      })
      if (!res.ok) throw new Error('Failed to remove topic')
      return res.json()
    },
    onError: (err) => {
      setError((err as Error).message || 'Failed to remove topic')
    }
  })

  const handleClick = async () => {
    setIsOpen(true)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/topics/unlocks?topic=${encodeURIComponent(topic)}`)
      if (!res.ok) throw new Error('Failed to fetch unlock info')
      const json = await res.json()
      setData(json.questionAnswersThatUnlockTopic)
    } catch (err) {
      setError((err as Error).message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveTopic = (question: string) => {
    setError(null)
    removeTopicMutation.mutate({ question, topic })
  }

  if (removeTopicMutation.isSuccess) {
    return null
  }

  return (
    <div className={styles.viewTopicButtonContainer}>
      <button type="button" onClick={handleClick} title="View Unlocks">
        { topic }
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Unlocks for "${topic}"`}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {(!loading && !error && data && data.length === 0) && <div>No unlocks found for this topic.</div>}
        {(!loading && !error && data && data.length > 0) && (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {data.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>Q:</strong> {item.question}
                  <button
                    type="button"
                    style={{ marginLeft: 8, fontSize: 12, padding: '2px 8px', cursor: 'pointer' }}
                    onClick={async () => {
                      await navigator.clipboard.writeText(item.question)
                      setCopiedIdx(idx)
                      setTimeout(() => setCopiedIdx(null), 1200)
                    }}
                  >
                    {copiedIdx === idx ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div><strong>A:</strong> {item.answer}</div>
              </li>
            ))}
          </ul>
        )}
        <ModalFooter>
          <SecondaryButton
            onClick={() => handleRemoveTopic(question)}
            disabled={removeTopicMutation.isPending}
          >
            {removeTopicMutation.isPending ? 'Removing...' : 'Remove This Topic Gate'}
          </SecondaryButton>
          <PrimaryButton onClick={() => setIsOpen(false)}>
            Close
          </PrimaryButton>
        </ModalFooter>
      </Modal>
    </div>
  )
}

