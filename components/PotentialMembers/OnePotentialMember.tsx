import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { PotentialChannelMemberType } from '../../models/potentialChannelMember'
import {
  getFarcasterUserDetails,
  getFarcasterCastDetails
} from '../../requests/farcaster'
import {
  FarcasterUserType,
  FarcasterCastType
} from '../../utils/neynarApi'
import styles from './styles.module.css'

type Props = {
  potentialMember: PotentialChannelMemberType
}

export const OnePotentialMember: React.FC<Props> = ({
  potentialMember
}) => {
  const [userDetails, setUserDetails] = useState<FarcasterUserType>()
  const [castDetails, setCastDetails] = useState<FarcasterCastType>()

  return (
    <div className={styles.onePotentialMember}>
      img
      fid
      username
      link to profile
      cast that was reacted to
    </div>
  )
}

