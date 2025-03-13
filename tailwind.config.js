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
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 0.1vh)",
                sm: "calc(var(--radius) - 0.2vh)",
            },
            borderColor: {
                DEFAULT: "hsl(var(--border))"
            }
        },
    },
    plugins: [
        ({ addUtilities }) => {
            addUtilities({
                '*': {
                    '&::-webkit-scrollbar': {
                        width: '1vh'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'hsl(var(--primary))',
                        borderRadius: 'var(--radius)'
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'hsl(var(--secondary))',
                    }
                }
            });
        }
    ],
}

