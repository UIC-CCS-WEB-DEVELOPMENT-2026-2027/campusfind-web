import { useState } from 'react'
import ItemDetails from './ItemDetails'
import ReportForm from './ReportForm'
import './UserDashboard.css'

function ConversationCard({ thread, session, onReply, onUpdateOutcome }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submitReply = (event) => {
    event.preventDefault()
    if (onReply(thread.id, message)) {
      setMessage('')
      setError('')
    } else {
      setError('The message could not be saved. Please try again.')
    }
  }

  return (
    <article className="contact-request-card">
      <div className="contact-request-heading">
        <div>
          <span className={`conversation-status ${thread.status.toLowerCase()}`}>{thread.status}</span>
          <h3>{thread.reportName}</h3>
          {thread.relatedReportName && (
            <p className="linked-report-name">
              Linked {thread.relatedReportType ?? 'item'} report: {thread.relatedReportName}
            </p>
          )}
        </div>
        <time dateTime={thread.messages.at(-1)?.createdAt ?? thread.createdAt}>
          {new Date(thread.messages.at(-1)?.createdAt ?? thread.createdAt).toLocaleString()}
        </time>
      </div>
      <div className="conversation-messages" aria-label="Conversation messages">
        {thread.messages.map((entry, index) => (
          <div className={entry.senderEmail === session.email ? 'conversation-message own-message' : 'conversation-message'} key={`${thread.id}-${index}`}>
            <div className="conversation-message-meta">
                <div className="conversation-sender">
                  <strong>{entry.senderName || 'CampusFind user'}</strong>
                  {entry.senderEmail === session.email && <span className="conversation-you-label">You</span>}
                  <span className="conversation-sender-email">{entry.senderEmail}</span>
                </div>
                <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
            </div>
            <p>{entry.message}</p>
          </div>
        ))}
      </div>
      {['Contacting', 'Matched'].includes(thread.status) && (
        <>
          <form className="conversation-reply-form" onSubmit={submitReply}>
            {error && <p className="contact-request-error" role="alert">{error}</p>}
            <label className="visually-hidden" htmlFor={`reply-${thread.id}`}>Reply to this conversation</label>
            <textarea
              id={`reply-${thread.id}`}
              maxLength={500}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a message..."
              required
              rows={2}
              value={message}
            />
            <button type="submit">Send reply</button>
          </form>
          <div className="conversation-outcomes" aria-label="Update report outcome">
            <span>When you agree on what happens next:</span>
            <button type="button" onClick={() => onUpdateOutcome(thread.id, 'Matched')}>Mark matched</button>
            <button type="button" onClick={() => onUpdateOutcome(thread.id, 'Claimed')}>Mark claimed</button>
            <button className="delist-action" type="button" onClick={() => onUpdateOutcome(thread.id, 'Delisted')}>Delist linked reports</button>
          </div>
        </>
      )}
      {thread.status === 'Delisted' && (
        <div className="conversation-outcomes">
          <span>These reports are hidden from the public board.</span>
          <button type="button" onClick={() => onUpdateOutcome(thread.id, 'Matched')}>Relist as matched</button>
        </div>
      )}
    </article>
  )
}

function initialsFromName(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase()
}

function UserDashboard({
  items,
  session,
  contactRequests,
  onSaveReport,
  onDeleteReport,
  onToggleReportListing,
  onReplyToContactRequest,
  onUpdateContactOutcome,
  requestedReportType,
  onReportRequestHandled,
}) {
  const [editingReport, setEditingReport] = useState(() => requestedReportType ? null : undefined)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportSaveMessage, setReportSaveMessage] = useState('')
  const reports = items.filter((item) => item.ownerEmail === session.email)
  const conversations = contactRequests.filter((request) =>
    [request.ownerEmail, request.senderEmail, request.relatedOwnerEmail].includes(session.email))
  const reportCounts = {
    total: reports.length,
    active: reports.filter((report) => !['Resolved', 'Claimed', 'Delisted'].includes(report.status)).length,
    matched: reports.filter((report) => report.status === 'Matched').length,
  }

  const saveReport = (report) => {
    if (onSaveReport(report)) {
      setEditingReport(undefined)
      onReportRequestHandled()
      setReportSaveMessage(report.id
        ? 'Your report changes were saved.'
        : 'Your report has been saved and added to the campus listings.')
    }
  }

  const cancelReport = () => {
    setEditingReport(undefined)
    onReportRequestHandled()
  }

  const deleteReport = (report) => {
    if (window.confirm(`Delete your report for "${report.name}"?`)) onDeleteReport(report.id)
  }

  return (
    <div className="user-dashboard">
      <section className="user-dashboard-header">
        <div className="user-welcome">
          <span className="eyebrow">YOUR CAMPUSFIND</span>
          <h1>Welcome back, {session.name.split(' ')[0]}</h1>
          <p>Keep track of your reports and see what needs your attention.</p>
        </div>
        <a className="dashboard-home-link" href="#home">Browse campus items <span aria-hidden="true">→</span></a>
      </section>

      <section className="user-overview" aria-label="Profile and report summary">
        <article className="profile-card">
          <div className="profile-avatar" aria-hidden="true">{initialsFromName(session.name)}</div>
          <div className="profile-details">
            <span className="profile-label">SIGNED-IN ACCOUNT</span>
            <h2>{session.name}</h2>
            <p>{session.email}</p>
          </div>
          <span className="demo-badge">Prototype account</span>
        </article>

        <div className="summary-grid">
          <article className="summary-card">
            <span className="summary-icon reports-icon" aria-hidden="true">▤</span>
            <span className="summary-label">My reports</span>
            <strong>{reportCounts.total}</strong>
          </article>
          <article className="summary-card">
            <span className="summary-icon active-icon" aria-hidden="true">◷</span>
            <span className="summary-label">Active reports</span>
            <strong>{reportCounts.active}</strong>
          </article>
          <article className="summary-card">
            <span className="summary-icon matched-icon" aria-hidden="true">✓</span>
            <span className="summary-label">Potential matches</span>
            <strong>{reportCounts.matched}</strong>
          </article>
        </div>
      </section>

      <div className="status-guide">
        <details>
          <summary>What do report statuses mean?</summary>
          <dl>
            <div><dt>In review</dt><dd>Visible on the board and waiting for someone to contact you.</dd></div>
            <div><dt>Matched</dt><dd>You believe this report is connected to another report; coordinate the return in Conversations.</dd></div>
            <div><dt>Claimed</dt><dd>The item has been marked as returned to its owner.</dd></div>
            <div><dt>Delisted</dt><dd>The report is hidden from the public board but remains in your dashboard.</dd></div>
          </dl>
        </details>
      </div>

      <section className="reports-section contact-requests-section" aria-labelledby="contact-requests-title">
        <div className="reports-heading">
          <div>
            <span className="eyebrow">MESSAGES</span>
            <h2 id="contact-requests-title">Conversations</h2>
            <p>Contact each other, compare reports, then agree on the item’s outcome.</p>
          </div>
          <span className="requests-count">{conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}</span>
        </div>
        {conversations.length > 0 ? (
          <div className="contact-requests-list">
            {conversations.map((thread) => (
              <ConversationCard
                key={thread.id}
                onReply={onReplyToContactRequest}
                onUpdateOutcome={onUpdateContactOutcome}
                session={session}
                thread={thread}
              />
            ))}
          </div>
        ) : (
          <p className="contact-requests-empty">No conversations yet. Open a report to contact its owner.</p>
        )}
        <p className="data-disclaimer">Prototype: conversations and outcomes are stored only in this browser. They do not sync to other devices or send external notifications.</p>
      </section>

      <section className="reports-section" aria-labelledby="reports-title">
        <div className="reports-heading">
          <div>
            <span className="eyebrow">ACTIVITY</span>
            <h2 id="reports-title">My reports</h2>
            <p>Review the items you’ve reported and their latest status.</p>
          </div>
          <div className="new-report-actions" aria-label="Create a report">
            <button className="new-report-button new-lost-report-button" onClick={() => setEditingReport({ type: 'Lost' })} type="button">
              <span aria-hidden="true">⌕</span> Report lost
            </button>
            <button className="new-report-button new-found-report-button" onClick={() => setEditingReport({ type: 'Found' })} type="button">
              <span aria-hidden="true">✓</span> Report found
            </button>
          </div>
        </div>
        {reportSaveMessage && <p className="report-save-success" role="status">{reportSaveMessage}</p>}

        {reports.length > 0 ? (
          <div className="reports-list">
            {reports.map((report) => (
              <article className="report-row" key={report.id}>
                <div className={`report-type-icon ${report.type.toLowerCase()}`} aria-hidden="true">
                  {report.type === 'Lost' ? '⌕' : '✓'}
                </div>
                <div className="report-main">
                  <div className="report-title-line">
                    <button
                      className="report-details-trigger"
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      aria-label={`View details for ${report.name}`}
                    >
                      {report.name}
                    </button>
                    <span className={`report-type-label ${report.type.toLowerCase()}`}>{report.type}</span>
                  </div>
                  <p>{report.location} <span aria-hidden="true">·</span> {report.date}</p>
                </div>
                <div className="report-status-wrap">
                  <span className={`report-status ${(report.status ?? 'In review').toLowerCase().replaceAll(' ', '-')}`}>
                    <span aria-hidden="true" />
                    {report.status ?? 'In review'}
                  </span>
                  <div className="report-actions">
                    <button type="button" onClick={() => setEditingReport(report)}>Edit</button>
                    <button
                      className={report.isListed === false ? '' : 'delist-report-action'}
                      type="button"
                      onClick={() => onToggleReportListing(report.id, report.isListed === false)}
                    >
                      {report.isListed === false ? 'Relist' : 'Delist'}
                    </button>
                    <button className="delete-report-button" type="button" onClick={() => deleteReport(report)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="reports-empty-state">
            <span aria-hidden="true">▤</span>
            <h3>No reports yet</h3>
            <p>Create a lost or found report and it will also appear on the campus listings board.</p>
            <div className="new-report-actions">
              <button className="new-report-button new-lost-report-button" onClick={() => setEditingReport({ type: 'Lost' })} type="button">Report lost item</button>
              <button className="new-report-button new-found-report-button" onClick={() => setEditingReport({ type: 'Found' })} type="button">Report found item</button>
            </div>
          </div>
        )}
        <p className="data-disclaimer">
          Prototype only: account data and reports are stored in this browser. They do not sync to other devices, and browser-local authentication is not secure production sign-in.
        </p>
      </section>
      {editingReport !== undefined && (
        <ReportForm
          initialType={requestedReportType ?? editingReport?.type ?? 'Lost'}
          report={editingReport?.id ? editingReport : null}
          onCancel={cancelReport}
          onSave={saveReport}
        />
      )}
      {selectedReport && (
        <ItemDetails
          item={selectedReport}
          onClose={() => setSelectedReport(null)}
          requestSent={conversations.some((request) =>
            request.reportId === selectedReport.id && request.senderEmail === session.email)}
          session={session}
        />
      )}
    </div>
  )
}

export default UserDashboard
