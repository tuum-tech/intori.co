import { httpsCallable } from 'firebase/functions'
import { analytics, auth, functions } from '../../../utils/firebase'

import { UserInfo } from '@/lib/magic/user'
import { logEvent } from 'firebase/analytics'

type Response = {
  success: string
  totalUsers: number
  userStats: Stats
  appStats: Stats
}

export type Stats = {
  uploadedFiles: number
  ordersProcessed: number
  vcsCreated: number
  vcsValue: number
}

export type TotalStats = {
  totalUsers: number
  userStats: Stats
  appStats: Stats
}

export async function getUserStatsFirebase(): Promise<TotalStats> {
  const appStat: TotalStats = {
    totalUsers: 0,
    userStats: {
      uploadedFiles: 0,
      ordersProcessed: 0,
      vcsCreated: 0,
      vcsValue: 0
    },
    appStats: {
      uploadedFiles: 0,
      ordersProcessed: 0,
      vcsCreated: 0,
      vcsValue: 0
    }
  }
  const userInfo: UserInfo = JSON.parse(
    localStorage.getItem('userInfo') ?? '{}'
  )
  const getUserStatsFunction = httpsCallable(functions, 'getUserStats')
  try {
    const token = await auth.currentUser?.getIdToken(true)
    const params = {
      authToken: token
    }
    const response = await getUserStatsFunction(params)
    const result = response.data as Response
    if (result.success) {
      console.log('Retrieved user stats successfully')
      // Log the event to firebase
      if (analytics) {
        logEvent(analytics, `getUserStats: successful for user ${userInfo}`)
      }

      appStat.totalUsers = result.totalUsers
      appStat.userStats = result.userStats
      appStat.appStats = result.appStats
    }
  } catch (error) {
    console.log(`Error while trying to get user stats: ${error}`)
  }
  return appStat
}
