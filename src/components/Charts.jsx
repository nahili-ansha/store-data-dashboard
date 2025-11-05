import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Charts.css'

// Price range chart
function PriceDistribution({ items }) {
  const data = useMemo(() => {
    const ranges = [
      { range: '0-25', min: 0, max: 25 },
      { range: '25-50', min: 25, max: 50 },
      { range: '50-100', min: 50, max: 100 },
      { range: '100+', min: 100, max: Infinity },
    ]

    return ranges.map((r) => ({
      name: `$${r.range}`,
      count: items.filter((i) => i.price >= r.min && i.price < r.max).length
    }))
  }, [items])

  return (
    <div className="chart-container">
      <h3>Price Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Category distribution pie chart
function CategoryDistribution({ items }) {
  const data = useMemo(() => {
    const counts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [items])

  const COLORS = ['#7c3aed', '#2563eb', '#db2777', '#ea580c', '#84cc16', '#14b8a6']

  return (
    <div className="chart-container">
      <h3>Category Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Charts({ items }) {
  if (!items || items.length === 0) return null

  return (
    <section className="charts-row">
      <PriceDistribution items={items} />
      <CategoryDistribution items={items} />
    </section>
  )
}