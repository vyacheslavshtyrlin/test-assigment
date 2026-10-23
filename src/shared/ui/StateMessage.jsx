import { AlertIcon, BoxIcon } from './Icons.jsx'

function StateMessage({ type = 'empty', title, message, onRetry }) {
  return (
    <div className={`state-message alert ${type === 'error' ? 'alert-danger error' : 'alert-light'}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="state-icon">{type === 'error' ? <AlertIcon /> : <BoxIcon />}</span>
      <div><strong>{title}</strong><p>{message}</p></div>
      {onRetry ? <button className="btn btn-outline-dark btn-sm" type="button" onClick={onRetry}>Повторить</button> : null}
    </div>
  )
}

export default StateMessage
