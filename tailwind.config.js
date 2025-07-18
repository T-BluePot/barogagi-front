/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#BAFD4F",
        "main-dark": "#8ED71B",
        "main-disable": "#D6FF96",
        "alert-red": "#FF3B38",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "sans-serif"],
      },
      fontSize: {
        header: ["28px", { lineHeight: "34px", letterSpacing: "-2.5%" }],
        "title-01": ["24px", { lineHeight: "30px", letterSpacing: "-2.5%" }],
        "title-02": ["20px", { lineHeight: "25px", letterSpacing: "-2.5%" }],
        subtitle: ["16px", { lineHeight: "21px", letterSpacing: "-2.5%" }],
        body: ["16px", { lineHeight: "21px", letterSpacing: "-2.5%" }],
        caption: ["14px", { lineHeight: "19px", letterSpacing: "-2.5%" }],
        description: ["12px", { lineHeight: "16px", letterSpacing: "-2.5%" }],
      },
      spacing: {
        "screen-padding": "24px",
        "header-bar": "60px",
        "footer-bar": "56px",
        "button-height": "56px",
        "gap-section": "32px",
        "gap-sm": "8px",
        "gap-md": "16px",
      },
      borderRadius: {
        card: "0.75rem",
        button: "9999px",
      },
      animation: {
        "slide-left-to-right": "slideLeftToRight 3s ease-in-out infinite",
        "slide-right-to-left": "slideRightToLeft 3s ease-in-out infinite",
      },
      keyframes: {
        slideLeftToRight: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "20%": { transform: "translateX(-100%)", opacity: "0" },
          "50%": { transform: "translateX(0%)", opacity: "1" },
          "80%": { transform: "translateX(0%)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        slideRightToLeft: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "20%": { transform: "translateX(100%)", opacity: "0" },
          "50%": { transform: "translateX(0%)", opacity: "1" },
          "80%": { transform: "translateX(0%)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
