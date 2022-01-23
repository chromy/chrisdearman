module.exports = {
  content: ["./src/**/*", "./tools/**/*"],
  theme: {
    fontFamily: {
      "display": ["Advocate", "ui-sans-serif", "system-ui"],
      "body": ["Equity", "ui-serif", "system-ui"],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
