
import { useState } from 'react'
import './ReportLostForm.css'

function ReportLostForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="report-lost-page">
      <div className="report-lost-card">
        <h1>Report a Lost Item</h1>
        <p>
          Please provide the details of your lost item so it can be identified.
        </p>

        {submitted && (
          <p role="status" style={{ color: 'green', fontWeight: 'bold' }}>
            Your lost item report was submitted successfully!
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="itemName">Item Name</label>
          <input
            id="itemName"
            name="itemName"
            type="text"
            placeholder="Enter item name"
            required
            onChange={() => setSubmitted(false)}
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            defaultValue=""
            required
            onChange={() => setSubmitted(false)}
          >
            <option value="" disabled>
              Select category
            </option>
            <option>Electronics</option>
            <option>School Supplies</option>
            <option>Personal Belongings</option>
            <option>Documents or IDs</option>
            <option>Other</option>
          </select>

          <label htmlFor="dateLost">Date Lost</label>
          <input
            id="dateLost"
            name="dateLost"
            type="date"
            required
            onChange={() => setSubmitted(false)}
          />

          <label htmlFor="locationLost">Location Lost</label>
          <input
            id="locationLost"
            name="locationLost"
            type="text"
            placeholder="Enter location"
            required
            onChange={() => setSubmitted(false)}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Describe the item"
            required
            onChange={() => setSubmitted(false)}
          />

          <label htmlFor="itemPhoto">Item Photo</label>
          <input
            id="itemPhoto"
            name="itemPhoto"
            type="file"
            accept="image/*"
          />

          <button type="submit">
            Submit Lost Item Report
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReportLostForm
