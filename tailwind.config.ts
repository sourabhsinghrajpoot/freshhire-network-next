import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: { 600: '#1769d1', 700: '#0c54b0' } } } }, plugins: [] } satisfies Config;
