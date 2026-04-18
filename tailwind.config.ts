import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:      '#F46A35',
          orangeHover: '#D85A28',
          cream:       '#F7F5EE',
          dark:        '#1A1A1A',
          muted:       '#6B7280',
          border:      '#E5E0D8',
          success:     '#2D6A4F',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};

export default config;
