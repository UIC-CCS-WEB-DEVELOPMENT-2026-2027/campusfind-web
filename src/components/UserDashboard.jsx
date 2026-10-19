import { useState } from 'react'
import ReportForm from './ReportForm'
import './UserDashboard.css'

function initialsFromName(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase()
}

function UserDashboard({ items, session, onSaveReport, onDeleteReport }) {
  const [editingReport, setEditingReport] = useState(undefined)
  const reports = items.filter((item) => item.ownerEmail === session.email)
  const reportCounts = {
    total: reports.length,
    active: reports.filter((report) => !['Resolved', 'Claimed'].includes(report.status)).length,
    matched: reports.filter((report) => report.status === 'Matched').length,
  }

  const saveReport = (report) => {
    if (onSaveReport(report)) setEditingReport(undefined)
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

      <section className="reports-section" aria-labelledby="reports-title">
        <div className="reports-heading">
          <div>
            <span className="eyebrow">ACTIVITY</span>
            <h2 id="reports-title">My reports</h2>
            <p>Review the items you’ve reported and their latest status.</p>
          </div>
          <button className="new-report-button" onClick={() => setEditingReport(null)} type="button">
            <span aria-hidden="true">+</span> New report
          </button>
        </div>

        {reports.length > 0 ? (
          <div className="reports-list">
            {reports.map((report) => (
              <article className="report-row" key={report.id}>
                <div className={`report-type-icon ${report.type.toLowerCase()}`} aria-hidden="true">
                  {report.type === 'Lost' ? '⌕' : '✓'}
                </div>
                <div className="report-main">
                  <div className="report-title-line">
                    <h3>{report.name}</h3>
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
            <button className="new-report-button" onClick={() => setEditingReport(null)} type="button">Create your first report</button>
          </div>
        )}
        <p className="data-disclaimer">
          Prototype only: authentication is stored in this browser and is not secure production sign-in. Reports are saved here and visible on the public campus board.
        </p>
      </section>
      {editingReport !== undefined && (
        <ReportForm
          report={editingReport}
          onCancel={() => setEditingReport(undefined)}
          onSave={saveReport}
        />
      )}
    </div>
  )
}

export default UserDashboard
