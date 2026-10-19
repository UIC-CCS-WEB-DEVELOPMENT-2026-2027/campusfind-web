import { useMemo, useState } from 'react'
import sampleItems from '../data/items.json'
import './Dashboard.css'

const categories = ['All categories', ...new Set(sampleItems.map((item) => item.category))]
const buildings = ['All locations', ...new Set(sampleItems.map((item) => item.location))]

function Dashboard() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All items')
  const [category, setCategory] = useState('All categories')
  const [location, setLocation] = useState('All locations')

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return sampleItems.filter((item) => {
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
  }, [query, type, category, location])

  const clearFilters = () => {
    setQuery('')
    setType('All items')
    setCategory('All categories')
    setLocation('All locations')
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
          <span className="art-spark spark-one">✦</span>
          <span className="art-spark spark-two">✧</span>
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
          <span className="sample-note">Sample listings</span>
        </div>

        <div className="search-panel">
          <label className="search-field">
            <span className="visually-hidden">Search items</span>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by item, place, or keyword..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="select-field">
            <span className="visually-hidden">Filter by category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span className="visually-hidden">Filter by location</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
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
                onClick={() => setType(value)}
                type="button"
                aria-pressed={type === value}
              >
                {value}
                {value === 'All items' && <span className="tab-count">{sampleItems.length}</span>}
              </button>
            ))}
          </div>
          <span className="results-count" aria-live="polite">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="item-grid">
            {filteredItems.map((item) => (
              <article className="item-card" key={item.id}>
                <div className={`item-illustration ${item.color}`}>
                  <span className="item-image-fallback" aria-hidden="true">{item.icon}</span>
                  <img
                    className="item-image"
                    src={item.image}
                    alt={`Photo of ${item.name}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.hidden = true
                      const credit = event.currentTarget.parentElement.querySelector('.photo-credit')
                      if (credit) credit.hidden = true
                    }}
                  />
                  <a
                    className="photo-credit"
                    href={item.imageSource}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Photo credit: ${item.imageCredit}`}
                  >
                    {item.imageCredit}
                  </a>
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
                </div>
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
      </section>

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
