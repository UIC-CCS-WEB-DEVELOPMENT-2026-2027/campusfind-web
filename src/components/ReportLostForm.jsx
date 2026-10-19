import "./ReportLostForm.css";
function ReportLostForm() {
  return (
    <div className="report-lost-page">
      <div className="report-lost-card">
        <h1>Report a Lost Item</h1>
        <p>
          Please provide the details of your
          lost item so it can be identified.
        </p>

        <form>
          <label htmlFor="itemName">Item Name</label>
          <input
            id="itemName"
            type="text"
            placeholder="Enter item name"
            required
          />

          <label htmlFor="category">Category</label>
          <select id="category" defaultValue="" required>
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
          <input id="dateLost" type="date" required />

          <label htmlFor="locationLost">
            Location Lost
          </label>
          <input
            id="locationLost"
            type="text"
            placeholder="Enter location"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Describe the item"
            required
          />

          <label htmlFor="itemPhoto">Item Photo</label>
          <input
            id="itemPhoto"
            type="file"
            accept="image/*"
          />

          <button type="button">
            Submit Lost Item Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportLostForm;
