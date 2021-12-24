// Custom webpack configuration, adding:
//   - Sentry
//     - https://nextjs.org/docs/api-reference/next.config.js/introduction
//     - https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = !!SENTRY_DSN ? withSentryConfig({}, { silent: true }) : {}
