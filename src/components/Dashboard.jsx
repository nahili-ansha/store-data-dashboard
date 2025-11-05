import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import './Dashboard.css'
import Charts from './Charts'

// Dashboard using Fake Store API: https://fakestoreapi.com/products
export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  // fetch products
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (mounted) setItems(data)
      } catch (err) {
        if (mounted) setError(String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => (mounted = false)
  }, [])

  // unique categories for filter
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return ['all', ...Array.from(set)]
  }, [items])

  // filtered items based on search + category
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      if (category !== 'all' && it.category !== category) return false
      if (!q) return true
      return it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)
    })
  }, [items, query, category])

  // summary stats: total, avg price, median price, avg rating
  const stats = useMemo(() => {
    const total = items.length
    if (total === 0) return { total: 0, avgPrice: 0, medianPrice: 0, avgRating: 0 }

    const prices = items.map((i) => Number(i.price)).filter((p) => !Number.isNaN(p)).sort((a, b) => a - b)
    const avgPrice = prices.reduce((s, p) => s + p, 0) / prices.length
    const medianPrice = prices.length % 2 === 1 ? prices[(prices.length - 1) / 2] : (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2

    const ratings = items.map((i) => (i.rating && i.rating.rate) || 0)
    const avgRating = ratings.reduce((s, r) => s + r, 0) / ratings.length

    return { total, avgPrice, medianPrice, avgRating }
  }, [items])

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h1>Store Dashboard</h1>
        <p className="subtitle">Explore products — search, filter by category, and see summary statistics</p>
      </header>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${stats.avgPrice.toFixed(2)}</div>
          <div className="stat-label">Average price</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${stats.medianPrice.toFixed(2)}</div>
          <div className="stat-label">Median price</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgRating.toFixed(2)}</div>
          <div className="stat-label">Average rating</div>
        </div>
      </section>

      <Charts items={items} />

      <section className="controls-row">
        <input
          className="search"
          placeholder="Search products by title or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select className="filter" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      <section className="list">
        {loading && <div className="empty">Loading products...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && filtered.length === 0 && <div className="empty">No products match your query</div>}

        {!loading && !error && filtered.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="product-cell">
                    <Link to={`/product/${p.id}`} className="product-link">
                      <img src={p.image} alt={p.title} />
                      <div>
                        <div className="prod-title">{p.title}</div>
                        <div className="prod-desc">{p.description.slice(0, 120)}{p.description.length > 120 ? '…' : ''}</div>
                      </div>
                    </Link>
                  </td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.rating ? `${p.rating.rate} (${p.rating.count})` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer className="dashboard-footer">Data source: Fake Store API — https://fakestoreapi.com/</footer>
    </div>
  )
}
