import { globalCss } from '../stitches.config'

const globalStyles = globalCss({
  /************************************************
   * CSS reset by Andy Bell                       *
   * https://piccalil.li/blog/a-modern-css-reset/ *
   ************************************************/

  /* Box sizing rules */
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  /* Remove default margin and padding */
  'body, h1, h2, h3, h4, p, figure, blockquote, dl, dd': {
    margin: 0,
    padding: 0,
  },

  //anchor
  a: {
    all: 'unset',
    cursor: 'pointer',
    color: 'inherit',
    textDecoration: 'none',
  },

  /* Set core root defaults */
  'html:focus-within': {
    scrollBehavior: 'smooth',
  },

  /* Set core body defaults */
  body: {
    minHeight: '100vh',
    textRendering: 'optimizeSpeed',
    lineHeight: '1.5',
  },

  /* Make images easier to work with */
  'img, picture': {
    maxWidth: '100%',
    display: 'block',
  },

  /* Inherit fonts for inputs and buttons */
  'input, button, textarea, select': {
    font: 'inherit',
  },

  /*********************
   * Custom base styles *
   *********************/

  'html, body': {
    overflow: 'hidden',
  },

  body: {
    background: '$beige',
    fontColor: '$black',
    fontFamily: '$regular',
    fontSize: '16px',
    fontWeight: '400',
  },

  'h1, h2, h3, h4, h5, h6': {
    fontWeight: '400',
  },

  em: {
    fontFamily: '$italic',
    fontWeight: '400',
  },

  button: {
    border: 'none',
    cursor: 'pointer',
    '&:focus, &:focus-visible': {
      outline: 'none',
    },
  },
})

export default globalStyles
