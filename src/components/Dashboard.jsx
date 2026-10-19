import { useMemo, useState } from 'react'
import sampleItems from '../data/items.json'
import ItemDetails from './ItemDetails'
import './Dashboard.css'

const ITEMS_PER_PAGE = 6

function Dashboard({
  items = sampleItems,
  currentUserEmail,
  contactRequests,
  onSendContactRequest,
  session,
}) {
  const listedItems = items.filter((item) => item.isListed !== false)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All items')
  const [category, setCategory] = useState('All categories')
  const [location, setLocation] = useState('All locations')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const categories = ['All categories', ...new Set(listedItems.map((item) => item.category))]
  const buildings = ['All locations', ...new Set(listedItems.map((item) => item.location))]

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return listedItems.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [item.name, item.category, item.location, item.description]
          .some((value) => value.toLowerCase().includes(normalizedQuery))

      return (
        matchesQuery &&
        (type === 'All items' || item.type === type) &&
        (category === 'All categories' || item.category === category) &&
        (location === 'All locations' || item.location === location)
      )
    })
  }, [listedItems, query, type, category, location])

  const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const currentPage = Math.min(page, Math.max(pageCount, 1))
  const pageItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )
  const firstPageNumber = Math.max(1, Math.min(currentPage - 2, pageCount - 4))
  const visiblePageNumbers = Array.from(
    { length: Math.min(pageCount, 5) },
    (_, index) => firstPageNumber + index,
  )

  const clearFilters = () => {
    setQuery('')
    setType('All items')
    setCategory('All categories')
    setLocation('All locations')
    setPage(1)
  }

  return (
    <div className="dashboard">
      <section className="dashboard-hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> CAMPUS LOST &amp; FOUND</span>
          <h1>Lost something?<br /><span>Let’s find it.</span></h1>
          <p>
            One campus, one place to reconnect people with the things they’ve lost.
            Search recent reports or browse by item type.
          </p>
          <a className="hero-link" href="#items">Explore recent items <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-card art-card-back"><span>FOUND</span><b>Keys</b></div>
          <div className="art-card art-card-front">
            <span className="art-card-icon">🔎</span>
            <span className="art-card-label">A little help goes a long way</span>
            <b>Find it.<br />Return it.</b>
            <span className="art-card-brand">campusfind</span>
          </div>
        </div>
      </section>

      <section className="browse-section" id="items" aria-labelledby="browse-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE CAMPUS BOARD</span>
            <h2 id="browse-title">Recently reported</h2>
            <p>Browse the latest lost and found reports from around campus.</p>
          </div>
          <div className="listing-actions">
            {currentUserEmail && <a className="manage-reports-link" href="#dashboard">Manage my reports</a>}
            <span className="sample-note">Sample + browser reports</span>
          </div>
        </div>

        <div className="search-panel">
          <label className="search-field">
            <span className="visually-hidden">Search items</span>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by item, place, or keyword..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
          </label>
          <label className="select-field">
            <span className="visually-hidden">Filter by category</span>
            <select value={category} onChange={(event) => {
              setCategory(event.target.value)
              setPage(1)
            }}>
              {categories.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span className="visually-hidden">Filter by location</span>
            <select value={location} onChange={(event) => {
              setLocation(event.target.value)
              setPage(1)
            }}>
              {buildings.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="list-toolbar">
          <div className="item-tabs" role="group" aria-label="Filter item type">
            {['All items', 'Lost', 'Found'].map((value) => (
              <button
                className={type === value ? 'item-tab active' : 'item-tab'}
                key={value}
                onClick={() => {
                  setType(value)
                  setPage(1)
                }}
                type="button"
                aria-pressed={type === value}
              >
                {value}
                {value === 'All items' && <span className="tab-count">{listedItems.length}</span>}
              </button>
            ))}
          </div>
          <span className="results-count" aria-live="polite">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="item-grid">
            {pageItems.map((item) => (
              <article className="item-card" key={item.id}>
                <button
                  className="item-card-button"
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  aria-label={`View details for ${item.name}`}
                >
                  <div className={`item-illustration ${item.color}`}>
                    <span className="item-image-fallback" aria-hidden="true">{item.icon}</span>
                    {item.image && (
                      <img
                        className="item-image"
                        src={item.image}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <span className={`status-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                  </div>
                  <div className="item-content">
                    <div className="item-meta">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="item-location"><span aria-hidden="true">⌖</span>{item.location}</div>
                    {['Matched', 'Claimed'].includes(item.status) && (
                      <span className={`item-lifecycle-status ${item.status.toLowerCase()}`}>{item.status}</span>
                    )}
                    <span className="item-view-details">View details <span aria-hidden="true">→</span></span>
                  </div>
                </button>
                {item.imageCredit && item.imageSource && (
                  <a
                    className="photo-credit"
                    href={item.imageSource}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Photo credit: ${item.imageCredit}`}
                  >
                    {item.imageCredit}
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>No matching items</h3>
            <p>Try a different keyword or clear your filters to see all reports.</p>
            <button className="clear-button" type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
        {pageCount > 1 && (
          <nav className="items-pagination" aria-label="Item listing pages">
            <span className="pagination-summary">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length}
            </span>
            <div className="pagination-controls">
              <button
                className="pagination-arrow"
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>
              {firstPageNumber > 1 && (
                <>
                  <button type="button" onClick={() => setPage(1)} aria-label="Go to page 1">1</button>
                  {firstPageNumber > 2 && <span className="pagination-ellipsis" aria-hidden="true">…</span>}
                </>
              )}
              {visiblePageNumbers.map((pageNumber) => (
                <button
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                  aria-label={`Go to page ${pageNumber}`}
                  className={currentPage === pageNumber ? 'active' : ''}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}
              {firstPageNumber + visiblePageNumbers.length - 1 < pageCount && (
                <>
                  {firstPageNumber + visiblePageNumbers.length < pageCount && (
                    <span className="pagination-ellipsis" aria-hidden="true">…</span>
                  )}
                  <button type="button" onClick={() => setPage(pageCount)} aria-label={`Go to page ${pageCount}`}>
                    {pageCount}
                  </button>
                </>
              )}
              <button
                className="pagination-arrow"
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </section>

      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSendContactRequest={onSendContactRequest}
          requestSent={contactRequests?.some((request) =>
            request.reportId === selectedItem.id &&
            request.senderEmail === currentUserEmail &&
            ['Contacting', 'Matched'].includes(request.status))}
          relatedReports={listedItems.filter((report) =>
            report.ownerEmail === currentUserEmail &&
            report.type !== selectedItem.type &&
            !['Claimed', 'Delisted'].includes(report.status))}
          session={session}
        />
      )}

      <section className="how-it-works" id="how-it-works" aria-labelledby="how-title">
        <div>
          <span className="eyebrow">A COMMUNITY EFFORT</span>
          <h2 id="how-title">Small steps. Happy reunions.</h2>
        </div>
        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">01</span>
            <h3>Search the board</h3>
            <p>Look through recent reports and filter by item, category, or location.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <h3>Report an item</h3>
            <p>Share a clear description and where the item was lost or found.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <h3>Verify and reunite</h3>
            <p>Confirm ownership details before arranging a safe return on campus.</p>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
