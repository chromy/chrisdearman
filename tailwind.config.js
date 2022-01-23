module.exports = {
  content: ["./src/**/*", "./tools/**/*"],
  theme: {
    fontFamily: {
      "display": ["Advocate", "ui-sans-serif", "system-ui"],
      "body": ["Equity", "ui-serif", "system-ui"],
      "mono": ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation\\ Mono", "Courier\\ New", "monospace"],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
