
import './DateSorting.css'

function DateSorting({ sortOrder, onSortChange }) {
  return (
    <label className="select-field">
      <span className="visually-hidden">
        Filter by date
      </span>

      <select
        value={sortOrder}
        onChange={(event) => onSortChange(event.target.value)}
      >
        <option value="all">All dates</option>
        <option value="week">Less than a week</option>
        <option value="twoWeeks">2 weeks</option>
        <option value="threeWeeks">3 weeks</option>
        <option value="month">A month</option>
        <option value="older">Older</option>
      </select>
    </label>
  )
}

export default DateSorting
