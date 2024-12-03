import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        jcb: '#fcb026',
        darkTable: '#212529',
        darkTableDivide: '#565656',
        darkTableHead: '#2A2C2E',
        darkTableHover: '#57534e',
        dashBox: '#33373e',
        dashBackground: '#20232a',
        open: '#dc2626',
        contained: '#eab308',
        closed: '#16a34a',
        tbc: '#64748b',
        audited: '#2563eb',
        issued: '#78716c',
      },
      fontFamily: {
        Lato: 'Lato',
        LatoBold: 'Lato-Bold',
      },
      height: {
        verticalCenter: 'calc(100vh - 90px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config
