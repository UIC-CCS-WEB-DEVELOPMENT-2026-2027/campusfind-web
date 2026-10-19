import { useEffect, useState } from 'react'
import './ItemDetails.css'

function ItemDetails({
  item,
  onClose,
  session,
  requestSent,
  relatedReports = [],
  onSendContactRequest,
}) {
  const [message, setMessage] = useState('')
  const [contactError, setContactError] = useState('')
  const [sent, setSent] = useState(false)
  const [relatedReportId, setRelatedReportId] = useState(relatedReports[0]?.id ?? '')

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const submitContactRequest = (event) => {
    event.preventDefault()
    if (!message.trim()) {
      setContactError('Add a message so the report owner knows why you are contacting them.')
      return
    }
    if (onSendContactRequest({ item, message, relatedReportId })) {
      setSent(true)
      setContactError('')
    } else {
      setContactError('Your request could not be saved. Please try again.')
    }
  }

  return (
    <div className="item-details-backdrop" onClick={onClose}>
      <section
        className="item-details-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="item-details-close" type="button" aria-label="Close item details" onClick={onClose} autoFocus>
          ×
        </button>
        <div className={`item-details-image ${item.color ?? 'lavender'}`}>
          <span className="item-details-fallback" aria-hidden="true">{item.icon ?? '🔎'}</span>
          {item.image && (
            <img
              src={item.image}
              alt={`Photo of ${item.name}`}
              onError={(event) => { event.currentTarget.hidden = true }}
            />
          )}
        </div>
        <div className="item-details-content">
          <div className="item-details-tags">
            <span className={`status-badge ${item.type.toLowerCase()}`}>{item.type}</span>
            <span>{item.category}</span>
          </div>
          <h2 id="item-details-title">{item.name}</h2>
          <p className="item-details-description">{item.description}</p>
          <dl className="item-details-facts">
            <div>
              <dt>Location</dt>
              <dd>{item.location}</dd>
            </div>
            <div>
              <dt>Date reported</dt>
              <dd>{item.date}</dd>
            </div>
            {item.status && (
              <div>
                <dt>Status</dt>
                <dd>{item.status}</dd>
              </div>
            )}
          </dl>
          {item.imageCredit && item.imageSource && (
            <a className="item-details-credit" href={item.imageSource} target="_blank" rel="noreferrer">
              Photo: {item.imageCredit}
            </a>
          )}
          <div className="item-contact">
            <h3>Contact about this report</h3>
            {!item.ownerEmail ? (
              <p className="item-contact-note">This is a sample listing and has no account owner to contact.</p>
            ) : !session ? (
              <p className="item-contact-note">
                <a href="#login">Sign in</a> to contact the report owner.
              </p>
            ) : item.ownerEmail === session.email ? (
              <p className="item-contact-note">This is your report. Contact requests will appear in your dashboard.</p>
            ) : sent || requestSent ? (
              <p className="item-contact-success" role="status">
                This conversation is saved in this browser. Open your dashboard to exchange messages and update the report outcome.
              </p>
            ) : ['Claimed', 'Delisted'].includes(item.status) ? (
              <p className="item-contact-note">This report is {item.status.toLowerCase()} and is no longer accepting contact requests.</p>
            ) : (
              <form className="item-contact-form" onSubmit={submitContactRequest}>
                {contactError && <p className="item-contact-error" role="alert">{contactError}</p>}
                <label htmlFor="item-contact-message">
                  {item.type === 'Found' ? 'I think this is mine' : 'I found this item'}
                </label>
                {relatedReports.length > 0 && (
                  <>
                    <label htmlFor="related-report">
                      Link one of your {item.type === 'Found' ? 'lost' : 'found'} reports
                    </label>
                    <select
                      id="related-report"
                      onChange={(event) => setRelatedReportId(event.target.value)}
                      required
                      value={relatedReportId}
                    >
                      {relatedReports.map((report) => (
                        <option key={report.id} value={report.id}>{report.name}</option>
                      ))}
                    </select>
                  </>
                )}
                <textarea
                  id="item-contact-message"
                  maxLength={500}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write a short message to the report owner"
                  required
                  rows={3}
                  value={message}
                />
                <button type="submit">Send contact request</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ItemDetails
