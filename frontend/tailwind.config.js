/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080C14",
        card: "#0F172A",
        cardBorder: "#1E293B",
        cardHover: "#162032",
        accentBlue: "#3B82F6",
        accentIndigo: "#6366F1",
        accentCyan: "#06B6D4",
        safeGreen: "#10B981",
        warningAmber: "#F59E0B",
        dangerRed: "#EF4444",
        textMuted: "#94A3B8"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};
