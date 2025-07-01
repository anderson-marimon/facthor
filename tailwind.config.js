module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        fontFamily: {
            nunito: ['nunito', 'sans-serif']
        },
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--primary)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    facthor: "var(--primary-facthor)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    facthor: "var(--secondary-facthor)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    facthor: "var(--muted-facthor)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                pantone: "#041C2C",
                alpha: '#289c64'

            },
            fontSize: {
                xxs: '11px'
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 0.1vh)",
                sm: "calc(var(--radius) - 0.2vh)",
            },
            borderColor: {
                DEFAULT: "var(--border)"
            },
            ringColor: {
                DEFAULT: "var(--secondary)"
            },
            keyframes: {
                'opacity-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                },
                'opacity-out': {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 }
                }
            },
            animation: {
                'opacity-in': 'opacity-in 0.5s ease',
                'opacity-out': 'opacity-out 0.5s ease',
            }
        },
    },
    plugins: [
        ({ addUtilities }) => {
            addUtilities({
                '*': {
                    '&::-webkit-scrollbar': {
                        width: '4px',
                        height: '4px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--primary)',
                        borderRadius: 'var(--radius)',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'var(--secondary)',
                    },
                },
            });
        }
    ],
}

