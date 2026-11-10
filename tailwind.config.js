/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                marca: {
                    50: '#fdf3f2',
                    100: '#fbe4e1',
                    200: '#f5c6c0',
                    500: '#c0392e',
                    600: '#a32c23',
                    700: '#86231c',
                    800: '#6b1d18',
                    900: '#4c1512',
                },
            },
            boxShadow: {
                cartao: '0 1px 2px rgb(41 37 36 / 0.05), 0 1px 3px rgb(41 37 36 / 0.07)',
            },
            keyframes: {
                surgir: {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                surgir: 'surgir 150ms ease-out',
            },
        },
    },
    plugins: [],
};
