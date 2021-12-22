import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN =
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://cca39ced93b04586b7b3426376280745@o1097219.ingest.sentry.io/6118513'

Sentry.init({
  dsn: process.env.NODE_ENV === 'production' ? SENTRY_DSN : null,
  tracesSampleRate: 0.05, // 5%
})
