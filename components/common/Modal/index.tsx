import React from 'react'
import ReactModal from 'react-modal'
import styles from './styles.module.css'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        { !!title && <h2>{title}</h2>}
        { children }
      </ReactModal>
    )
}

export const ModalFooter: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className={styles.modalFooter}>
      { children }
    </div>
  )
}
