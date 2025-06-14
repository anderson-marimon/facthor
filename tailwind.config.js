module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        fontFamily: {
            nunito: ['nunito', 'sans-serif']
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--primary))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    facthor: "hsl(var(--primary-facthor))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    facthor: "hsl(var(--secondary-facthor))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    facthor: "hsl(var(--muted-facthor))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                pantone: '#041C2C'
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
                DEFAULT: "hsl(var(--border))"
            },
            ringColor: {
                DEFAULT: "hsl(var(--secondary))"
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
                        backgroundColor: 'hsl(var(--primary))',
                        borderRadius: 'var(--radius)',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'hsl(var(--secondary))',
                    },
                },
            });
        }
    ],
}

