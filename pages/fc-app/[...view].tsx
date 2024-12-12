import { useEffect, useMemo } from 'react'
import sdk from '@farcaster/frame-sdk'
import { useRouter } from 'next/router'
import type { NextPage, GetServerSideProps } from "next";
import { IntoriFarcasterAppRoutes } from '../../utils/fc-app/routes'

import styles from './styles.module.css'

type Props = {
  something?: string
}

export const getServerSideProps = (async () => {
  return {
    props: {}
  }
}) satisfies GetServerSideProps<Props>

const IntoriFarcasterApp: NextPage<Props> = () => {
  const router = useRouter();

  const CurrentView = useMemo(() => {
    let { view } = router.query;

    console.log({ view })

    if (view) {
      if (Array.isArray(view)) {
        view = view[0];
      }

      const route = IntoriFarcasterAppRoutes.find((route) => route.view === view);

      if (route) {
        console.log(route.component)
        return route.component;
      }
    }

    return ;
  }, [router])

  useEffect(() => {
    const initialize = async () => {
      await sdk.actions.ready()
      const context = await sdk.context
      console.log({ context })
    }

    initialize()
  }, [])

  return (
    <div className={styles.fcAppWrapper}>
      {CurrentView}
      <a href="https://intori.co" className={styles.fcAppFooter}>
        intori.co
      </a>
    </div>
  )
}

export default IntoriFarcasterApp
