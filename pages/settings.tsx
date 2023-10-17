import type { NextPage } from 'next'
import SettingsFullContentSection from '../components/settings/settings-full-content-section'
import SideNavigationMenu from '../components/side-navigation/side-navigation-menu'

const Settings: NextPage = () => {
  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu
        logoutIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/d6fad1ad-c629-4d54-9ece-1f08eb1c22d4_1697120606059746562?Expires=-62135596800&Signature=abGQIwTFqcAuXLcZubCIcaq3G4PrMETYL40fB5om0w9mj8sIeg46PCYgGQZgquk3QuaV72nrgXGqj962Sdg-XGDxBZ~V4l~LN2A4~5trIZEG71mvxi2gq9MQFpJgpi9HCPR8El8B0RNRdJQjoDKjG5N1FgbHfq5MazSqpIdTBXIm~zRxvqGns3rcePD6148BbfYZC8zuD4lZkqa0OECxZF6zXuRJ-XxlwOmn2vtsLkuaPlFEvhCrdGS~dabztd9rmswp7oev8zd70mtUg4-lLq2EgSXTL9wgUJfMwTqg6MRsHzfsSA~oVaKSO1-3LKWlWABLnZmM7WsNPseeunFXrw__&Key-Pair-Id=K1P54FZWCHCL6J`}
      />
      <SettingsFullContentSection />
    </div>
  )
}

export default Settings
