const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [
        plugin(function ({addBase, theme}) {
            addBase({
                'h1': {fontSize: theme('fontSize.2xl')},
                'h2': {fontSize: theme('fontSize.xl')},
                'h3': {fontSize: theme('fontSize.lg')},
            })
        })
    ],
    theme: {
        screens: {
            'tablet': '640px',
            // => @media (min-width: 640px) { ... }

            'laptop': '1024px',
            // => @media (min-width: 1024px) { ... }

            'desktop': '1280px',
            // => @media (min-width: 1280px) { ... }
        },
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--secondary)',
                buttons: 'var(--color-buttons)',
                typography: 'var(--color-typography)',
                anchors: 'var(--color-anchors)',
                anchorsHover: 'var(--color-anchors-hover)',

                main: '#88aaee',
                mainAccent: '#4d80e6', // not needed for shadcn components
                overlay: 'rgba(0,0,0,0.8)', // background color overlay for alert dialogs, modals, etc.

                // light mode
                bg: '#dfe5f2',
                text: '#000',
                border: '#000',

                // dark mode
                darkBg: '#272933',
                darkText: '#eeefe9',
                darkBorder: '#000',
                secondaryBlack: '#212121', // opposite of plain white, not used pitch black because borders and box-shadows are that color
                headerBg: "#333333",
                lightText: "#ccffff",
                linkColor: "#0099ff",
            },
            borderRadius: {
                base: '5px'
            },
            boxShadow: {
                light: '4px 4px 0px 0px #000',
                dark: '4px 4px 0px 0px #000',
            },
            translate: {
                boxShadowX: '4px',
                boxShadowY: '4px',
                reverseBoxShadowX: '-4px',
                reverseBoxShadowY: '-4px',
            },
            fontWeight: {
                base: '500',
                heading: '700',
            },
        },
    }
}