import { useRef, useState } from 'react'
import './ReportLostForm.css'

const initialForm = {
  itemName: '',
  category: '',
  description: '',
  location: '',
  dateLost: '',
  contact: '',
  verification1: '',
  verification2: '',
  verification3: '',
}

const today = new Date()
const todayValue = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-')

function ReportLostForm({ isSignedIn, onSubmitReport }) {
  const [form, setForm] = useState(initialForm)
  const [photo, setPhoto] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const photoInputRef = useRef(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setMessage('')
  }

  const handlePhotoChange = (event) => {
    const [file] = event.target.files ?? []
    setMessage('')

    if (!file) {
      setPhoto('')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setPhoto('')
      event.target.value = ''
      setMessageType('report-error')
      setMessage('Choose an image file for the item photo.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhoto('')
      event.target.value = ''
      setMessageType('report-error')
      setMessage('Choose a photo smaller than 5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result)
      } else {
        setMessageType('report-error')
        setMessage('The selected photo could not be loaded. Please try another image.')
      }
    }
    reader.onerror = () => {
      setMessageType('report-error')
      setMessage('The selected photo could not be loaded. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhoto('')
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('')

    if (!isSignedIn) {
      setMessageType('report-auth-required')
      setMessage('You need to sign in before you can submit a lost-item report.')
      return
    }

    const unanswered = Object.values(form).some((value) => !value.trim())
    if (unanswered) {
      setMessageType('report-error')
      setMessage('Please complete all required fields.')
      return
    }

    const lostDate = new Date(`${form.dateLost}T00:00:00`)
    if (Number.isNaN(lostDate.getTime()) || form.dateLost > todayValue) {
      setMessageType('report-error')
      setMessage('Enter a valid date that is not in the future.')
      return
    }

    const date = lostDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    onSubmitReport({
      id: `report-${Date.now()}`,
      name: form.itemName.trim(),
      type: 'Lost',
      category: form.category,
      location: form.location.trim(),
      date,
      icon: '📦',
      image: photo || undefined,
      color: 'blue',
      description: form.description.trim(),
    })

    setForm(initialForm)
    setPhoto('')
    setMessageType('report-success')
    setMessage('Your lost-item report has been submitted.')
  }

  return (
    <section className="report-page" aria-labelledby="report-title">
      <div className="report-card">
        <a className="report-back-link" href="#home">← Back to campus board</a>
        <header className="report-header">
          <span className="report-icon" aria-hidden="true">🔎</span>
          <div>
            <span className="report-eyebrow">CAMPUS LOST &amp; FOUND</span>
            <h1 id="report-title">Report a Lost Item</h1>
            <p className="report-intro">
              Provide the details below to help the campus community identify and return your missing item.
            </p>
          </div>
        </header>

        {message && (
          <div className={`report-message ${messageType}`} role={messageType === 'report-error' ? 'alert' : 'status'}>
            <p>{message}</p>
            {messageType === 'report-auth-required' && (
              <a href="#login">Go to sign in <span aria-hidden="true">→</span></a>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <h2>Item details</h2>
          <div className="report-form-grid">
            <div className="report-field">
              <label htmlFor="itemName">Item name <span aria-hidden="true">*</span></label>
              <input
                id="itemName"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g. Black wallet"
                maxLength="80"
                autoComplete="off"
                required
              />
            </div>

            <div className="report-field">
              <label htmlFor="category">Category <span aria-hidden="true">*</span></label>
              <select id="category" name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Personal belongings">Personal belongings</option>
                <option value="School supplies">School supplies</option>
                <option value="Documents">Documents</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="report-field report-field-full">
              <label htmlFor="description">Item description <span aria-hidden="true">*</span></label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the item, its color, brand, and identifying features."
                maxLength="500"
                rows="4"
                required
              />
              <small>{form.description.length}/500 characters</small>
            </div>

            <div className="report-field report-field-full">
              <label htmlFor="itemPhoto">Item photo <span className="report-optional">(optional)</span></label>
              <input
                id="itemPhoto"
                ref={photoInputRef}
                name="itemPhoto"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoChange}
                aria-describedby="itemPhoto-help"
              />
              <small id="itemPhoto-help">Add a clear photo so people browsing the board can recognize your item. JPG, PNG, GIF, or WebP, up to 5 MB.</small>
              {photo && (
                <div className="report-photo-preview">
                  <img src={photo} alt="Preview of the lost item" />
                  <button className="report-photo-remove" type="button" onClick={removePhoto}>
                    Remove photo
                  </button>
                </div>
              )}
            </div>

            <div className="report-field">
              <label htmlFor="location">Where was it lost? <span aria-hidden="true">*</span></label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Building, room, or campus area"
                maxLength="100"
                required
              />
            </div>

            <div className="report-field">
              <label htmlFor="dateLost">Date lost <span aria-hidden="true">*</span></label>
              <input
                id="dateLost"
                name="dateLost"
                type="date"
                value={form.dateLost}
                onChange={handleChange}
                max={todayValue}
                required
              />
            </div>

            <div className="report-field report-field-full">
              <label htmlFor="contact">Contact information <span aria-hidden="true">*</span></label>
              <input
                id="contact"
                name="contact"
                type="text"
                value={form.contact}
                onChange={handleChange}
                placeholder="Email or another preferred contact"
                maxLength="254"
                autoComplete="email"
                required
              />
              <small>Your contact information is not displayed on the public campus board.</small>
            </div>
          </div>

          <section className="report-verification" aria-labelledby="verification-title">
            <h2 id="verification-title">Verification questions</h2>
            <p>
              These answers can help verify ownership if your item is found. They are kept private and are not shown on the campus board. Avoid passwords or other secrets.
            </p>

            <div className="report-field">
              <label htmlFor="verification1">1. What is a distinctive feature of your item? <span aria-hidden="true">*</span></label>
              <input
                id="verification1"
                name="verification1"
                value={form.verification1}
                onChange={handleChange}
                maxLength="200"
                required
              />
            </div>

            <div className="report-field">
              <label htmlFor="verification2">2. What was inside or attached to the item? <span aria-hidden="true">*</span></label>
              <input
                id="verification2"
                name="verification2"
                value={form.verification2}
                onChange={handleChange}
                maxLength="200"
                required
              />
            </div>

            <div className="report-field">
              <label htmlFor="verification3">3. Where exactly do you remember last having it? <span aria-hidden="true">*</span></label>
              <input
                id="verification3"
                name="verification3"
                value={form.verification3}
                onChange={handleChange}
                maxLength="200"
                required
              />
            </div>
          </section>

          <p className="report-required-note"><span aria-hidden="true">*</span> Required fields</p>
          <button className="report-submit-button" type="submit">Submit Report</button>
        </form>
      </div>
    </section>
  )
}

export default ReportLostForm
