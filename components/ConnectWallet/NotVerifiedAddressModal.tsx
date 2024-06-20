import React from 'react'
import { Modal, ModalFooter } from '../common/Modal'
import { PrimaryButton } from '../common/Button'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const NotVerifiedAddressModal: React.FC<Props> = ({
  isOpen,
  onClose
}) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Not a verified address"
      >
        <p>
          The wallet you are trying to connect is not verified with your Farcaster account.
        </p>

        <p>
          If you want to use this wallet, please verify it with your Farcaster account <a href="https://warpcast.com/~/settings/verified-addresses" target="_blank" rel="noopener noreferrer">here</a> and try again.
        </p>
        <ModalFooter>
          <PrimaryButton onClick={onClose}>
            Ok
          </PrimaryButton>
        </ModalFooter>
      </Modal>
    )
}

