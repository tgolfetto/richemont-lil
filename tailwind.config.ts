import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004165",
        surface: "#F5F5F4",
        footer: "#B9C9D0",
        gold: {
          DEFAULT: "#B4975A",
          50: "#faf7f0",
          100: "#f1ead8",
          200: "#e4d3ad",
          300: "#d6bc81",
          400: "#c7a65f",
          500: "#B4975A",
          600: "#9f7f42",
          700: "#7a5f30",
          800: "#55411f",
          900: "#30240f"
        },
        zinc: {
          950: "#515454"
        }
      },
      boxShadow: {
        luxury: "0 24px 60px rgba(17, 17, 17, 0.08)",
        insetGold: "inset 0 0 0 1px rgba(180, 151, 90, 0.18)"
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at top left, rgba(180,151,90,0.14), transparent 28%), radial-gradient(circle at top right, rgba(180,151,90,0.08), transparent 22%)"
      },
      fontFamily: {
        display: ["var(--font-sabon)", "serif"],
        sans: ["var(--font-sabon)", "serif"],
        button: ["var(--font-open-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
