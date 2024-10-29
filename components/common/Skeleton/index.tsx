import React from 'react'
import ReactSkeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './Skeleton.module.css'

type Props = {
  width?: string | number
  height?: string | number
  inline?: boolean
}

export const Skeleton: React.FC<Props> = ({ width, inline, height }) => {
    return (
      <ReactSkeleton
        className={styles.skeleton}
        width={width}
        height={height}
        inline={inline}
        duration={0.5}
      />
    )
}


export const SkeletonCircle: React.FC<Props> = ({ width, inline }) => {
  return (
    <ReactSkeleton
      className={styles.skeleton}
      width={width}
      height={width}
      inline={inline}
      circle
      duration={0.5}
    />
  )
}
