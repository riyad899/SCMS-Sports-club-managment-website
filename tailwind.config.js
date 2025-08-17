/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#162E50', // Optional: adds utility like bg-primary
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        sportsclubtheme: {
          primary: "#162E50",
          secondary: "#FBBF24",     // Optional secondary color
          accent: "#1FB2A6",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      {
        dark: {
          primary: "#3B82F6",
          secondary: "#FBBF24",
          accent: "#1FB2A6", 
          neutral: "#2A2E37",
          "base-100": "#1F2937",
          "base-200": "#111827",
          "base-300": "#374151",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
    darkTheme: "dark",
  },
};
