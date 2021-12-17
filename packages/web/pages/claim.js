import Layout from '../components/Layout'
import { useAppContext } from '../context/context'
import { styled } from '../stitches.config'

export default function Claim() {
  const { claimedPieces, addClaimedPiece } = useAppContext()

  return (
    <Layout>
      <p>claimedPieces: {claimedPieces}</p>
      <button onClick={() => addClaimedPiece(2)}>Claim</button>
    </Layout>
  )
}
