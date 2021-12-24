import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN =
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://2f93bb852b574a2f8a9169dfdebbb5e3@o1097219.ingest.sentry.io/6118716'

Sentry.init({
  dsn: process.env.NODE_ENV === 'production' ? SENTRY_DSN : null,
  tracesSampleRate: 0.05, // 5%
})
