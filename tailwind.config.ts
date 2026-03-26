import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0d0d0f",
        panel: "#17171b",
        line: "#2c2c34",
        accent: "#d9b15f",
        accentSoft: "#f7ead0",
        mint: "#9bd3c0",
        danger: "#f28b82"
      },
      boxShadow: {
        luxe: "0 20px 60px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(217, 177, 95, 0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(155, 211, 192, 0.16), transparent 25%)"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
