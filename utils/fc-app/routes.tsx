import React from 'react'
import { useRouter } from 'next/router'
import { Start } from '../../components/fc-app/pages/Start'

export const IntoriFarcasterAppRoutes = [
  {
    view: 'start',
    component: <Start />
  },
  {
    view: 'home',
    component: <h1>Home</h1>
  },
  {
    view: 'play',
    component: <h1>Play</h1>
  },
  {
    view: 'connect',
    component: <h1>Connect</h1>
  },
]

export const useFarcasterAppNavigator = () => {
  const router = useRouter();

  const navigate = (view: string) => {
    router.push(`/fc-app/${view}`);
  }

  return navigate;
}
