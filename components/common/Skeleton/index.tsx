import React from 'react'
import ReactSkeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './Skeleton.module.css'

type Props = {
  width?: string | number
  inline?: boolean
}

export const Skeleton: React.FC<Props> = ({ width, inline }) => {
    return (
      <ReactSkeleton
        className={styles.skeleton}
        width={width}
        inline={inline}
        duration={0.5}
      />
    )
}

