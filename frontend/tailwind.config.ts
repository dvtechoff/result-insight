import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: '#E5E7EB', // gray-200
				input: '#F3F4F6', // gray-100
				ring: '#1F2937', // gray-800
				background: '#FFFFFF',
				foreground: '#111111',
				primary: {
					DEFAULT: '#111111', // black
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#F3F4F6', // gray-100
					foreground: '#111111',
				},
				destructive: {
					DEFAULT: '#DC2626', // red-600
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F3F4F6', // gray-100
					foreground: '#6B7280', // gray-500
				},
				accent: {
					DEFAULT: '#2563EB', // blue-600
					foreground: '#FFFFFF',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#111111',
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#111111',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: '0.5rem',
				md: '0.375rem',
				sm: '0.25rem',
			},
			// Remove or neutralize gradients and fancy keyframes
			keyframes: {},
			animation: {},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
