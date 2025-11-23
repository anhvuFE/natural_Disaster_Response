import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: "#e0f2ff",
          100: "#b9e1ff",
          200: "#7ec7ff",
          300: "#52b3ff",
          400: "#2399ff",
          500: "#0b7fe6",
          600: "#0066c2",
          700: "#00529a",
          800: "#003d73",
          900: "#002a4f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
