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
        border: "var(--dl-border)",
        input: "var(--dl-border)",
        ring: withOpacity("--dl-number-rgb"),
        background: withOpacity("--dl-bg-rgb"),
        foreground: withOpacity("--dl-text-rgb"),
        brand: {
          primary: withOpacity("--dl-red-rgb"),
          secondary: withOpacity("--dl-red-soft-rgb"),
        },
        code: {
          keyword: "var(--dl-keyword)",
          string: "var(--dl-string)",
          number: "var(--dl-number)",
          function: "var(--dl-function)",
          warning: "var(--dl-warning)",
          error: "var(--dl-error)",
          comment: "var(--dl-comment)",
        },
        surface: {
          base: withOpacity("--dl-bg-rgb"),
          dark: withOpacity("--dl-black-rgb"),
          card: withOpacity("--dl-surface-rgb"),
          elevated: withOpacity("--dl-surface-2-rgb"),
          hover: withOpacity("--dl-surface-2-rgb"),
          highlight: withOpacity("--dl-surface-2-rgb"),
          panel: "var(--dl-surface)",
          panel2: "var(--dl-surface-2)",
        },
        content: {
          base: withOpacity("--dl-text-rgb"),
          primary: withOpacity("--dl-text-rgb"),
          secondary: withOpacity("--dl-muted-light-rgb"),
          tertiary: withOpacity("--dl-muted-rgb"),
          muted: withOpacity("--dl-muted-rgb"),
          highlight: withOpacity("--dl-text-rgb"),
        },
        success: withOpacity("--dl-string-rgb"),
        warning: withOpacity("--dl-warning-rgb"),
        error: withOpacity("--dl-error-rgb"),
        danger: withOpacity("--dl-error-rgb"),
        info: withOpacity("--dl-number-rgb"),
        premium: withOpacity("--dl-function-rgb"),
        prize: withOpacity("--dl-warning-rgb"),
        accent: {
          base: withOpacity("--dl-red-rgb"),
          DEFAULT: withOpacity("--dl-red-rgb"),
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
