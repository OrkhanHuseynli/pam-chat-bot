import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)'],
        mono: ['var(--font-geist-mono)'],
      },
      screens: {
        'toast-mobile': '600px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        neutral: '#F2F2F2',
        gray: {
          100: '#F2F2F2',
          200: '#E6E6E6',
          300: '#CCCCCC',
          400: '#B3B3B3',
          500: '#757575',
          600: '#656565',
          700: '#4D4D4D',
          800: '#333333',
          900: '#333333'
        },
        deep: {
          100: '#82A6C9',
          200: '#82A6C9',
          300: '#5380AC',
          400: '#386694',
          500: '#2B5580',
          600: '#1B456E',
          700: '#103559',
          800: '#082644',
          900: '#051C2C'
        },
        blue: {
          100: '#99C4FF',
          200: '#99C4FF',
          300: '#5E9DFF',
          400: '#2972FF',
          500: '#2251FF',
          600: '#1C44DC',
          700: '#1537BA',
          800: '#0E2B99',
          900: '#061F79'
        },
        cyan: {
          100: '#99E6FF',
          200: '#99E6FF',
          300: '#6ECBF7',
          400: '#34B4F4',
          500: '#00A9F4',
          600: '#0291DC',
          700: '#0679C3',
          800: '#0863AA',
          900: '#084D91'
        },
        crimson: {
          100: '#faa8a8',
          200: '#faa8a8',
          300: '#f17e7e',
          400: '#e65656',
          500: '#E33B3B',
          600: '#cd3030',
          700: '#b82525',
          800: '#a31919',
          900: '#8e0b0b'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
