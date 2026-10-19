import { useEffect, useRef, useState } from 'react'
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

function ReportForm({ report, initialType = 'Lost', onSave, onCancel }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(document.activeElement)
  const [name, setName] = useState(report?.name ?? '')
  const [type, setType] = useState(report?.type ?? initialType)
  const [category, setCategory] = useState(report?.category ?? '')
  const [location, setLocation] = useState(report?.location ?? '')
  const [description, setDescription] = useState(report?.description ?? '')
  const [dateValue, setDateValue] = useState(toDateTimeInput(report?.dateValue))
  const [image, setImage] = useState(report?.image ?? '')
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (previousFocusRef.current instanceof HTMLElement && previousFocusRef.current.isConnected) {
      previousFocusRef.current.focus()
    }
  }, [])

  const handleDialogKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
      return
    }
    if (event.key !== 'Tab') return

    const focusableElements = dialogRef.current?.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusableElements?.length) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

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
      isListed: report?.isListed ?? true,
      imageCredit: image.startsWith('data:') ? '' : report?.imageCredit ?? '',
      imageSource: image.startsWith('data:') ? '' : report?.imageSource ?? '',
    })
  }

  return (
    <div className="report-modal-backdrop">
      <section
        className="report-modal"
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-form-title"
      >
        <div className="report-modal-heading">
          <div>
            <span className="eyebrow">{report ? 'UPDATE YOUR REPORT' : `${type.toUpperCase()} ITEM REPORT`}</span>
            <h2 id="report-form-title">
              {report ? 'Edit report' : `Report a ${type.toLowerCase()} item`}
            </h2>
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
            <span className="field-help">
              {type === 'Lost'
                ? 'You lost this item and are hoping its finder can contact you.'
                : 'You found this item and want to help its owner identify it.'}
            </span>
          </label>
          <label>
            Item name
            <input autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} required value={name} />
            <span className="field-help">Include a clear name, such as “black water bottle” or “student ID card.”</span>
          </label>
          <label>
            Category
            <input maxLength={50} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Electronics" required value={category} />
            <span className="field-help">Choose a simple category such as electronics, clothing, or keys.</span>
          </label>
          <label>
            Campus location
            <input maxLength={100} onChange={(event) => setLocation(event.target.value)} placeholder="Building and area" required value={location} />
            <span className="field-help">Name the building and a specific area if you know it.</span>
          </label>
          <label>
            Date and time
            <input onChange={(event) => setDateValue(event.target.value)} required type="datetime-local" value={dateValue} />
          </label>
          <label className="report-description-field">
            Description
            <textarea aria-describedby="report-description-help" maxLength={500} onChange={(event) => setDescription(event.target.value)} placeholder="Add identifying details or other useful information" required rows={3} value={description} />
            <span className="field-help" id="report-description-help">
              Include colors, distinctive marks, or what was inside. Avoid posting private contact details.
            </span>
          </label>
          <label className="report-photo-field">
            Item photo {type === 'Found' ? '(required)' : '(optional)'}
            <input accept="image/*" onChange={handlePhotoChange} required={type === 'Found' && !image} type="file" />
            <span className="photo-help">
              {type === 'Found'
                ? 'Add a photo so the owner can recognize it. Images up to 1 MB are stored locally in this browser.'
                : 'A photo is optional. Images up to 1 MB are stored locally in this browser.'}
            </span>
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
