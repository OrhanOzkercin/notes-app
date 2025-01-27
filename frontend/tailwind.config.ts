import type { Config } from "tailwindcss";
import { tokens } from "./src/styles/design-tokens";
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
		container: {
			center: true,
			padding: {
        DEFAULT: tokens.spacing[4], // 16px
        sm: tokens.spacing[4],      // 16px
        lg: tokens.spacing[6],      // 24px
      },
      screens: {
        "2xl": "1280px",
      },
		},
		fontFamily: {
			cal: ["var(--font-cal)"],
		},
  	extend: {
      // Map spacing tokens
      spacing: tokens.spacing,
      // Map screen breakpoints
      screens: tokens.breakpoints,
  		colors: {
        // Map our design tokens directly
        primary: tokens.colors.primary,
        accent: tokens.colors.accent,
        secondary: tokens.colors.secondary,
        neutral: tokens.colors.neutral,
        success: tokens.colors.success,
        error: tokens.colors.error,
        warning: tokens.colors.warning,
        // Theme UI variables for dark mode
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [animate],
} satisfies Config;
