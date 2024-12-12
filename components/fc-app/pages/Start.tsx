import React from 'react'
import Image from 'next/image'
import { useFarcasterAppNavigator } from '../../../utils/fc-app/routes'
import styles from '../styles.module.css'

import { Page } from '../Page'
import { Button } from '../Button'

export const Start: React.FC = () => {
  const navigate = useFarcasterAppNavigator()

  return (
    <Page className={styles.startPageContainer}>
      <Image src="/assets/fc-app/logo.png" width="180" height="180" alt="Intori" />
      <h1>intori</h1>
      <h2>
        Unlock Connections
      </h2>
      <h3>
        gifting to like-minded people
      </h3>

      <Button type="button" onClick={() => navigate('play')}>
        Start
      </Button>
    </Page>
  )
}
