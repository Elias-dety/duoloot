import type { Config } from 'tailwindcss'

const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--dl-line)",
        input: "var(--dl-line)",
        ring: withOpacity("--dl-orange-rgb"),
        background: withOpacity("--dl-bg-rgb"),
        foreground: withOpacity("--dl-text-rgb"),
        brand: {
          primary: withOpacity("--dl-orange-rgb"),
          secondary: withOpacity("--dl-orange-strong-rgb"),
        },
        surface: {
          base: withOpacity("--dl-bg-soft-rgb"),
          dark: withOpacity("--dl-bg-rgb"),
          card: withOpacity("--dl-card-rgb"),
          elevated: withOpacity("--dl-card-elevated-rgb"),
          hover: withOpacity("--dl-card-hover-rgb"),
          highlight: withOpacity("--dl-card-hover-rgb"),
        },
        content: {
          base: withOpacity("--dl-text-rgb"),
          primary: withOpacity("--dl-text-rgb"),
          secondary: withOpacity("--dl-muted-rgb"),
          tertiary: withOpacity("--dl-muted-strong-rgb"),
          muted: withOpacity("--dl-muted-strong-rgb"),
          highlight: withOpacity("--dl-text-rgb"),
        },
        success: withOpacity("--dl-green-rgb"),
        warning: withOpacity("--dl-gold-rgb"),
        error: withOpacity("--dl-red-rgb"),
        danger: withOpacity("--dl-red-rgb"),
        info: withOpacity("--dl-blue-rgb"),
        premium: withOpacity("--dl-purple-rgb"),
        prize: withOpacity("--dl-gold-rgb"),
        accent: {
          base: withOpacity("--dl-orange-rgb"),
          DEFAULT: withOpacity("--dl-orange-rgb"),
          foreground: withOpacity("--dl-text-rgb"),
        },
      },
      borderRadius: {
        '2xl': "var(--radius-2xl)",
        xl: "var(--radius-xl)",
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        premium: "var(--shadow-premium)",
        prize: "var(--shadow-prize)",
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
      },
      fontSize: {
        'xs': 'var(--font-xs)',
        'sm': 'var(--font-sm)',
        'base': 'var(--font-base)',
        'lg': 'var(--font-lg)',
        'xl': 'var(--font-xl)',
        '2xl': 'var(--font-2xl)',
        '3xl': 'var(--font-3xl)',
      },
      zIndex: {
        'base': 'var(--z-base)',
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'overlay': 'var(--z-overlay)',
        'modal': 'var(--z-modal)',
        'toast': 'var(--z-toast)',
      },
      opacity: {
        'hover': 'var(--state-hover)',
        'active': 'var(--state-active)',
        'disabled': 'var(--state-disabled)',
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.28s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
