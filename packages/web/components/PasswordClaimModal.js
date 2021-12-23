import ReactModal from 'react-modal'

export default function PasswordClaimModal({ isOpen, setOpen }) {
  return (
    <div>
      Password
      <ReactModal isOpen={isOpen} onRequestClose={() => setOpen(false)} ariaHideApp={false}>
        <p>Test</p>
        <button onClick={() => setOpen(false)}>Close Modal</button>
      </ReactModal>
    </div>
  )
}
