import { useState } from 'react'
import './ReportForm.css'

function toDateTimeInput(value) {
  if (value) {
    const parsedDate = new Date(value)
    if (!Number.isNaN(parsedDate.getTime())) {
      const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000)
      return localDate.toISOString().slice(0, 16)
    }
  }

  const now = new Date()
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localNow.toISOString().slice(0, 16)
}

function formatReportDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ReportForm({ report, onSave, onCancel }) {
  const [name, setName] = useState(report?.name ?? '')
  const [type, setType] = useState(report?.type ?? 'Lost')
  const [category, setCategory] = useState(report?.category ?? '')
  const [location, setLocation] = useState(report?.location ?? '')
  const [description, setDescription] = useState(report?.description ?? '')
  const [dateValue, setDateValue] = useState(toDateTimeInput(report?.dateValue))
  const [image, setImage] = useState(report?.image ?? '')
  const [error, setError] = useState('')

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to attach.')
      event.target.value = ''
      return
    }

    if (file.size > 1024 * 1024) {
      setError('Choose an image smaller than 1 MB for this browser-only demo.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result)
        setError('')
      } else {
        setError('The selected image could not be read. Please choose another file.')
      }
    }
    reader.onerror = () => setError('The selected image could not be read. Please choose another file.')
    reader.readAsDataURL(file)
  }

  const submit = (event) => {
    event.preventDefault()
    if (type === 'Found' && !image) {
      setError('Please add a photo for a found item.')
      return
    }

    const date = formatReportDate(dateValue)
    onSave({
      ...report,
      name: name.trim(),
      type,
      category: category.trim(),
      location: location.trim(),
      description: description.trim(),
      date,
      dateValue,
      image,
      icon: report?.icon ?? (type === 'Found' ? '📦' : '🔎'),
      color: report?.color ?? 'lavender',
      status: report?.status ?? 'In review',
      imageCredit: image.startsWith('data:') ? '' : report?.imageCredit ?? '',
      imageSource: image.startsWith('data:') ? '' : report?.imageSource ?? '',
    })
  }

  return (
    <div className="report-modal-backdrop">
      <section className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-form-title">
        <div className="report-modal-heading">
          <div>
            <span className="eyebrow">{report ? 'UPDATE YOUR REPORT' : 'CAMPUS LOST & FOUND'}</span>
            <h2 id="report-form-title">{report ? 'Edit report' : 'Create a report'}</h2>
          </div>
          <button className="modal-close" type="button" aria-label="Close form" onClick={onCancel}>×</button>
        </div>

        {error && <p className="report-form-error" role="alert">{error}</p>}

        <form className="report-form" onSubmit={submit}>
          <label>
            Report type
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option>Lost</option>
              <option>Found</option>
            </select>
          </label>
          <label>
            Item name
            <input autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} required value={name} />
          </label>
          <label>
            Category
            <input maxLength={50} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Electronics" required value={category} />
          </label>
          <label>
            Campus location
            <input maxLength={100} onChange={(event) => setLocation(event.target.value)} placeholder="Building and area" required value={location} />
          </label>
          <label>
            Date and time
            <input onChange={(event) => setDateValue(event.target.value)} required type="datetime-local" value={dateValue} />
          </label>
          <label className="report-description-field">
            Description
            <textarea maxLength={500} onChange={(event) => setDescription(event.target.value)} placeholder="Add identifying details or other useful information" required rows={3} value={description} />
          </label>
          <label className="report-photo-field">
            Item photo {type === 'Found' ? '(required)' : '(optional)'}
            <input accept="image/*" onChange={handlePhotoChange} type="file" />
            <span className="photo-help">Image files up to 1 MB are stored locally in this browser.</span>
          </label>
          {image && (
            <div className="report-photo-preview">
              <img src={image} alt="Selected item" />
              <button type="button" onClick={() => setImage('')}>Remove photo</button>
            </div>
          )}
          <div className="report-form-actions">
            <button className="cancel-report-button" onClick={onCancel} type="button">Cancel</button>
            <button className="save-report-button" type="submit">{report ? 'Save changes' : 'Publish report'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ReportForm
