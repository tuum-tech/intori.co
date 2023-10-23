import type { NextPage } from 'next'

type SwitchThemeProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

const SwitchTheme: NextPage<SwitchThemeProps> = ({ theme, onToggle }) => {
  const togglePosition = theme === 'light' ? 'left-[7.69%]' : 'right-[7.69%]'
  const toggleBackgroundColor = theme === 'light' ? 'bg-white-1' : 'bg-primary'
  const sliderColor = theme === 'light' ? 'bg-primary' : 'bg-white-1'

  return (
    <div
      className={`relative rounded-xl ${toggleBackgroundColor} w-[35px] h-5 cursor-pointer`}
      onClick={onToggle}
    >
      <div
        className={`absolute h-[73.33%] w-[42.31%] top-[13.33%] ${togglePosition} bottom-[13.33%] rounded-sm ${sliderColor} shadow-[0px_2px_4px_rgba(0,_0,_0,_0.1),_0px_1px_2px_rgba(0,_0,_0,_0.1),_0px_1px_3px_rgba(0,_0,_0,_0.1)]`}
      />
    </div>
  )
}

export default SwitchTheme
