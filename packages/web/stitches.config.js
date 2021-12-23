import { createStitches } from '@stitches/react'

export const { config, createTheme, css, getCssText, globalCss, styled, theme } = createStitches({
  theme: {
    colors: {
      transparent: 'transparent',
      black: 'hsl(0, 0%, 0%)',
      white: 'hsl(0, 0%, 100%)',
      cherry: '#E64980',
      beige: '#F6F0E4',
      grey: '#D8D8D8',
    },
    space: {
      pagePadding: '20px',
    },
    sizes: {
      maxWidth: '1000px',
    },
    fontSizes: {},
    fonts: {
      regular: 'DM Sans',
      italic: 'PT Serif',
      system: 'system-ui',
    },
    fontWeights: {
      thin: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  utils: {
    size: (value) => ({
      width: value,
      height: value,
    }),
    marginX: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
  media: {},
})
