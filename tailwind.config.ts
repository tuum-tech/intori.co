import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'black-2': '#181716',
        'white-1': '#bdb5ab',
        'white-0': '#fff',
        'grey-1': '#777169',
        'black-1': '#110f0d',
        'black-4': '#2c261e',
        'black-3': '#1b1a19',
        primary: '#ff3b00',
        orangered: '#ff5927',
        'black-0': '#0f0a05',
        'brand-primary': '#ffd8d2',
        'grey-2': '#e4e2df'
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
  corePlugins: {
    preflight: false
  },
  plugins: []
}
export default config
