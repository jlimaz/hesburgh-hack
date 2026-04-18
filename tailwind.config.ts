import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:      '#F46A35',
          orangeHover: '#D85A28',
          yellow:      '#FFCE2E',
          yellowHover: '#FFD84A',
          cream:       '#F7F5EE',
          creamDeep:   '#F1EEE3',
          dark:        '#1A1A1A',
          ink:         '#0E0E0E',
          muted:       '#6B7280',
          mutedDeep:   '#4B5563',
          border:      '#E5E0D8',
          borderDeep:  '#D7D1C4',
          success:     '#2D6A4F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        quote: '0 30px 60px -20px rgba(26, 26, 26, 0.18), 0 12px 24px -12px rgba(26, 26, 26, 0.10)',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};

export default config;
