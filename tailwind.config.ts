import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fffaf2",
        panel: "#fffdf9",
        line: "#ecdcc1",
        accent: "#d59f2f",
        accentSoft: "#fff1d6",
        mint: "#78bfa8",
        danger: "#d96b57",
        ink: "#33251a",
        subink: "#7b6856",
        warm: "#f7b267"
      },
      boxShadow: {
        luxe: "0 18px 50px rgba(181, 138, 56, 0.14)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(213, 159, 47, 0.22), transparent 35%), radial-gradient(circle at bottom right, rgba(247, 178, 103, 0.2), transparent 24%)"
      },
      fontFamily: {
        display: ["Jua", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
