import { styled } from '../stitches.config'

const Information = styled('div', {
  paddingRight: '80px',
  minWidth: '300px',
  maxWidth: '30%',
})

const Text = styled('p', {
  color: '#000000',
  opacity: 0.5,
  margin: 0,
  padding: 0,

  variants: {
    type: {
      label: {
        opacity: 1,
      },
    },
  },
})

const Headline = styled('h1', {})

const Separator = styled('hr', {
  height: '1px',
  background: '#D8D8D8',
  border: 'none',
})

export default function InfoComponent({ headline }) {
  return (
    <Information>
      <Headline>{headline}</Headline>
      <Text css={{ marginBottom: '15px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.
      </Text>
      <Separator />
      <table>
        <tbody>
          <tr>
            <td>
              <Text type="label">Artist:</Text>
            </td>
            <td>
              <Text>Ari Garcia</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Text type="label">Date:</Text>
            </td>
            <td>
              <Text>December 2021</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Information>
  )
}
