import type { NextPage } from 'next'
import DashboardFullContentSection from '../components/dashboard/dashboard-full-content-section'
import SideNavigationMenu from '../components/side-navigation/SideNavigationMenu'

const Dashboard: NextPage = () => {
  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu
        logoutIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/7b8d61dc-5fea-4fd6-93e9-860c4689301c_1697120619217183326?Expires=-62135596800&Signature=tW3KEAPWXA64tPX~C~sbemme1tZR-Ar~Dp-1XhgyooQjuopw-kTcAlk7zJlZJzKs10QEqN0546ZIuhxeDVX5f1mgUwtBbw6pc5FTM7~oTvFqWG3Y0hTLw4~v~hG5nUat7Ry9Zv67nB9bNsVzZrH7E3NCabGlw2J0xD1JmVfHTh~nF65Vp78ZENlg5TUotYwQwhJqj6dJI9pLi4mECKGQMuLTBGaxl~jQvDw6y21Ud-O0f8ATq4sTQPPVm1Qgak9v~I9bI07cStHOQP2p6ZkYTWdqrdKtoNjWRLmTukI6bbvjn2TS5zb0-In-~lSakT2ZrjnBa6O5sbhQKFHYQ0-ZIA__&Key-Pair-Id=K1P54FZWCHCL6J`}
      />
      <DashboardFullContentSection />
    </div>
  )
}

export default Dashboard
