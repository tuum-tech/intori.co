import { useState } from 'react'
import { toast } from 'react-toastify'
import { NextPage } from 'next'
import {
  UserAnswerPageType
} from '../../models/userAnswers'
import styles from './styles.module.css'
import { PrimaryButton, SecondaryButton } from '../common/Button'
import { useEthereumWallet } from '../../contexts/EthereumWallet'
import { TransactionType } from '../../lib/ethers/registerCredential'
import { getBlockExplorerUrlForTransaction } from '../../lib/ethers/networks'
import { Empty } from '../common/Empty'
import { timeAgo } from '../../utils/textHelpers'

type Props = {
  response: UserAnswerPageType
}

export const OneResponseCard: NextPage<Props> = ({
  response
}) => {
  const {
    registerCredential,
    signer,
    attemptToConnectWallet
  } = useEthereumWallet()

  const [
    blockchainMetadata,
    setBlockchainMetadata
  ] = useState<Partial<TransactionType>>(
    response.publicBlockHash
      ? {
        hash: response.publicHash,
        blockHash: response.publicBlockHash,
        blockNumber: response.publicBlockNumber
      }
      : {}
  )

  const publishToBlockchain = async () => {
    if (!signer) {
      const promise = attemptToConnectWallet()

      toast.promise(
        promise,
        {
          pending: 'Connecting wallet...'
        }
      );
      return
    }

    const promise = (
      registerCredential(response)
      .then((tx: TransactionType|null) => {
        if (tx) {
          setBlockchainMetadata(tx)
        }
      })
    )

    toast.promise(
      promise,
      {
        pending: 'Publishing to blockchain...',
        success: 'Response published to the blockchain!',
        error: 'Failed to publish to blockchain. Please try again.',
      }
    );
  }

  return (
    <div className={styles.response}>
      <h4>
        {response.question}
      </h4>
      <h3>
        {response.answer}
      </h3>
      { !blockchainMetadata.hash && (
        <>
          <sub className={styles.private}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.4908 7.31016C14.4703 7.26387 13.974 6.16289 12.8707 5.05957C11.4006 3.58945 9.54374 2.8125 7.49999 2.8125C5.45624 2.8125 3.59941 3.58945 2.12929 5.05957C1.02597 6.16289 0.527338 7.26563 0.509174 7.31016C0.482522 7.3701 0.46875 7.43498 0.46875 7.50059C0.46875 7.56619 0.482522 7.63107 0.509174 7.69102C0.529682 7.7373 1.02597 8.8377 2.12929 9.94102C3.59941 11.4105 5.45624 12.1875 7.49999 12.1875C9.54374 12.1875 11.4006 11.4105 12.8707 9.94102C13.974 8.8377 14.4703 7.7373 14.4908 7.69102C14.5175 7.63107 14.5312 7.56619 14.5312 7.50059C14.5312 7.43498 14.5175 7.3701 14.4908 7.31016ZM7.49999 11.25C5.69648 11.25 4.12089 10.5943 2.8166 9.30176C2.28143 8.76955 1.82612 8.16267 1.46484 7.5C1.82602 6.83727 2.28134 6.23038 2.8166 5.69824C4.12089 4.40566 5.69648 3.75 7.49999 3.75C9.30351 3.75 10.8791 4.40566 12.1834 5.69824C12.7196 6.23025 13.1759 6.83714 13.5381 7.5C13.1156 8.28867 11.2752 11.25 7.49999 11.25ZM7.49999 4.6875C6.94373 4.6875 6.39997 4.85245 5.93745 5.16149C5.47494 5.47053 5.11445 5.90979 4.90158 6.4237C4.68871 6.93762 4.63301 7.50312 4.74154 8.04869C4.85006 8.59426 5.11792 9.0954 5.51126 9.48874C5.90459 9.88207 6.40573 10.1499 6.9513 10.2585C7.49687 10.367 8.06237 10.3113 8.57629 10.0984C9.09021 9.88554 9.52946 9.52505 9.8385 9.06254C10.1475 8.60003 10.3125 8.05626 10.3125 7.5C10.3117 6.75432 10.0152 6.0394 9.48788 5.51212C8.9606 4.98484 8.24568 4.68828 7.49999 4.6875ZM7.49999 9.375C7.12915 9.375 6.76664 9.26503 6.4583 9.05901C6.14996 8.85298 5.90963 8.56014 5.76772 8.21753C5.62581 7.87492 5.58867 7.49792 5.66102 7.13421C5.73337 6.77049 5.91195 6.4364 6.17417 6.17417C6.43639 5.91195 6.77049 5.73337 7.1342 5.66103C7.49791 5.58868 7.87491 5.62581 8.21753 5.76773C8.56014 5.90964 8.85297 6.14996 9.059 6.45831C9.26503 6.76665 9.37499 7.12916 9.37499 7.5C9.37499 7.99728 9.17745 8.47419 8.82582 8.82582C8.47419 9.17746 7.99728 9.375 7.49999 9.375Z" fill="#67625B"/> <line x1="1.8328" y1="2.12565" x2="12.4606" y2="12.7535" stroke="#67625B"/> </svg>
            This is only visible to you.
          </sub>
          <PrimaryButton onClick={publishToBlockchain}>
            Publish to Base
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.98579 18.3333C14.5958 18.3333 18.3333 14.6025 18.3333 10C18.3333 5.39751 14.5958 1.66667 9.98579 1.66667C5.61079 1.66667 2.02329 5.025 1.66663 9.3H12.7V10.7H1.66663C2.02329 14.975 5.61163 18.3333 9.98579 18.3333Z" fill="white"/> </svg>
          </PrimaryButton>
        </>
      )}

      { !!blockchainMetadata.hash && (
        <>
          <sub className={styles.public}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.4908 7.31016C14.4703 7.26387 13.974 6.16289 12.8707 5.05957C11.4006 3.58945 9.54374 2.8125 7.49999 2.8125C5.45624 2.8125 3.59941 3.58945 2.12929 5.05957C1.02597 6.16289 0.527338 7.26563 0.509174 7.31016C0.482522 7.3701 0.46875 7.43498 0.46875 7.50059C0.46875 7.56619 0.482522 7.63107 0.509174 7.69102C0.529682 7.7373 1.02597 8.8377 2.12929 9.94102C3.59941 11.4105 5.45624 12.1875 7.49999 12.1875C9.54374 12.1875 11.4006 11.4105 12.8707 9.94102C13.974 8.8377 14.4703 7.7373 14.4908 7.69102C14.5175 7.63107 14.5312 7.56619 14.5312 7.50059C14.5312 7.43498 14.5175 7.3701 14.4908 7.31016ZM7.49999 11.25C5.69648 11.25 4.12089 10.5943 2.8166 9.30176C2.28143 8.76955 1.82612 8.16267 1.46484 7.5C1.82602 6.83727 2.28134 6.23038 2.8166 5.69824C4.12089 4.40566 5.69648 3.75 7.49999 3.75C9.30351 3.75 10.8791 4.40566 12.1834 5.69824C12.7196 6.23025 13.1759 6.83714 13.5381 7.5C13.1156 8.28867 11.2752 11.25 7.49999 11.25ZM7.49999 4.6875C6.94373 4.6875 6.39997 4.85245 5.93745 5.16149C5.47494 5.47053 5.11445 5.90979 4.90158 6.4237C4.68871 6.93762 4.63301 7.50312 4.74154 8.04869C4.85006 8.59426 5.11792 9.0954 5.51126 9.48874C5.90459 9.88207 6.40573 10.1499 6.9513 10.2585C7.49687 10.367 8.06237 10.3113 8.57629 10.0984C9.09021 9.88554 9.52946 9.52505 9.8385 9.06254C10.1475 8.60003 10.3125 8.05626 10.3125 7.5C10.3117 6.75432 10.0152 6.0394 9.48788 5.51212C8.9606 4.98484 8.24568 4.68828 7.49999 4.6875ZM7.49999 9.375C7.12915 9.375 6.76664 9.26503 6.4583 9.05901C6.14996 8.85298 5.90963 8.56014 5.76772 8.21753C5.62581 7.87492 5.58867 7.49792 5.66102 7.13421C5.73337 6.77049 5.91195 6.4364 6.17417 6.17417C6.43639 5.91195 6.77049 5.73337 7.1342 5.66103C7.49791 5.58868 7.87491 5.62581 8.21753 5.76773C8.56014 5.90964 8.85297 6.14996 9.059 6.45831C9.26503 6.76665 9.37499 7.12916 9.37499 7.5C9.37499 7.99728 9.17745 8.47419 8.82582 8.82582C8.47419 9.17746 7.99728 9.375 7.49999 9.375Z" fill="#FFFFFF"/> </svg>
            This is published on the blockchain.
          </sub>
          <a href={getBlockExplorerUrlForTransaction(blockchainMetadata.hash)} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>
              View on Base
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V11.5C16 11.3674 16.0527 11.2402 16.1464 11.1464C16.2402 11.0527 16.3674 11 16.5 11C16.6326 11 16.7598 11.0527 16.8536 11.1464C16.9473 11.2402 17 11.3674 17 11.5V14C17 14.7956 16.6839 15.5587 16.1213 16.1213C15.5587 16.6839 14.7956 17 14 17H6C5.20435 17 4.44129 16.6839 3.87868 16.1213C3.31607 15.5587 3 14.7956 3 14V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8.5C8.63261 3 8.75979 3.05268 8.85355 3.14645C8.94732 3.24021 9 3.36739 9 3.5C9 3.63261 8.94732 3.75979 8.85355 3.85355C8.75979 3.94732 8.63261 4 8.5 4H6ZM11 3.5C11 3.36739 11.0527 3.24021 11.1464 3.14645C11.2402 3.05268 11.3674 3 11.5 3H16.5C16.6326 3 16.7598 3.05268 16.8536 3.14645C16.9473 3.24021 17 3.36739 17 3.5V8.5C17 8.63261 16.9473 8.75979 16.8536 8.85355C16.7598 8.94732 16.6326 9 16.5 9C16.3674 9 16.2402 8.94732 16.1464 8.85355C16.0527 8.75979 16 8.63261 16 8.5V4.707L11.854 8.854C11.7601 8.94789 11.6328 9.00063 11.5 9.00063C11.3672 9.00063 11.2399 8.94789 11.146 8.854C11.0521 8.76011 10.9994 8.63278 10.9994 8.5C10.9994 8.36722 11.0521 8.23989 11.146 8.146L15.293 4H11.5C11.3674 4 11.2402 3.94732 11.1464 3.85355C11.0527 3.75979 11 3.63261 11 3.5Z" fill="white"/> </svg>
            </SecondaryButton>
          </a>
        </>
      )}
      <div className={styles.date}>
        You answered {timeAgo(new Date(response.date.seconds * 1000).toISOString())}
      </div>
    </div>
  )
}

export const ListResponses: React.FC<{
  responses: UserAnswerPageType[]
}> = ({ responses }) => {
  return (
    <div className={styles.responsesContainer}>
      {
        responses.length === 0 && (
          <Empty>
            You have not answered any questions yet.

            <br />

            Visit <a href="https://warpcast.com/~/channel/intori">Intori</a> on Farcaster and answer some frames!
          </Empty>
        )
      }
      {
        responses.map((response) => (
          <OneResponseCard
            key={response.date.seconds}
            response={response}
          />
        ))
      }
    </div>
  )
}
