import type { Config } from 'tailwindcss'
import { COLORS } from './lib/colors'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'black-2': COLORS['black-2'],
        'white-1': COLORS['white-1'],
        'white-0': COLORS['white-0'],
        'grey-1': COLORS['grey-1'],
        'black-1': COLORS['black-1'],
        'black-4': COLORS['black-4'],
        'black-3': COLORS['black-3'],
        primary: COLORS['primary'],
        orangered: COLORS['orangered'],
        'black-0': COLORS['black-0'],
        'brand-primary': COLORS['brand-primary'],
        'grey-2': COLORS['grey-2']
      },
      backgroundColor: {
        'primary-hover': '#bdb5ab'
      },
      spacing: {
        boundvariablesdata: '24px',
        boundvariablesdata2: '8px',
        boundvariablesdata3: '4px',
        boundvariablesdata4: '28px'
      },
      fontFamily: {
        'kumbh-sans': "'Kumbh Sans'"
      },
      borderRadius: {
        mini: '15px',
        xl: '20px',
        '276xl': '295px',
        '3xs': '10px',
        '31xl': '50px',
        sm: '14px',
        boundvariablesdata1: '8px'
      }
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      '3xl': '22px',
      '19xl': '38px',
      lg: '18px',
      '36xl': '55px',
      base: '16px',
      '9xl': '28px',
      '13xl': '32px',
      '11xl': '30px',
      inherit: 'inherit'
    },
    screens: {
      lg: {
        max: '1200px'
      },
      md: {
        max: '960px'
      },
      sm: {
        max: '420px'
      },
      Small_Tablet: {
        raw: 'screen and (max-width: 800px)'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus']
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
}
export default config
