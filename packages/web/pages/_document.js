import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { getCssText } from '../stitches.config'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans&family=PT+Serif:ital@1&display=swap"
            rel="stylesheet"
          />
          <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
        </Head>
        <body style={{ backgroundColor: '#F6F0E4', margin: 0, overflow: 'hidden' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
