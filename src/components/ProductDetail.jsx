import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (mounted) setProduct(data)
      })
      .catch((err) => {
        if (mounted) setError(String(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => (mounted = false)
  }, [id])

  if (loading) return <div className="detail-loading">Loading product details...</div>
  if (error) return <div className="detail-error">{error}</div>
  if (!product) return <div className="detail-error">Product not found</div>

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <div className="detail-grid">
        <div className="detail-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="detail-info">
          <h1>{product.title}</h1>
          <p className="detail-category">{product.category}</p>
          
          <div className="detail-price-rating">
            <div className="detail-price">${product.price.toFixed(2)}</div>
            <div className="detail-rating">
              ★ {product.rating?.rate || '—'} ({product.rating?.count || 0} reviews)
            </div>
          </div>

          <p className="detail-description">{product.description}</p>
        </div>
      </div>
    </div>
  )
}