import { useState, useEffect, useCallback } from 'react'
import { fetchExpenses } from '../api'
import ExpenseInput from './ExpenseInput'
import ExpenseList from './ExpenseList'
import Chart from './Chart'

export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [filter, setFilter] = useState('all')

  const loadExpenses = useCallback(async () => {
    setFetchError('')
    setLoading(true)
    try {
      const data = await fetchExpenses()
      setExpenses(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message
      setFetchError(msg || 'Could not connect to server at http://localhost:5000')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

  // Computed stats
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = (e.category || 'other').toLowerCase()
    acc[cat] = (acc[cat] || 0) + Number(e.amount || 0)
    return acc
  }, {})

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  // Categories for filter
  const categories = ['all', ...new Set(expenses.map((e) => (e.category || 'other').toLowerCase()))]

  const filteredExpenses =
    filter === 'all'
      ? expenses
      : expenses.filter((e) => (e.category || 'other').toLowerCase() === filter)

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '0 0 60px',
      }}
    >
      {/* Top nav bar */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            height: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                background: 'var(--accent)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              💸
            </div>
            <span
              style={{
                fontFamily: 'Syne',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.03em',
                color: 'var(--text)',
              }}
            >
              xpensetrack
            </span>
          </div>

          <div
            style={{
              fontFamily: 'DM Mono',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '4px 10px',
            }}
          >
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '28px 24px 0',
        }}
      >
        {/* Page title */}
        <div className="fade-in" style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: 'Syne',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              letterSpacing: '-0.04em',
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            Expense
            <span style={{ color: 'var(--accent)' }}> Dashboard</span>
          </h1>
          <p
            style={{
              marginTop: 6,
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontFamily: 'DM Mono',
            }}
          >
            Track, visualise &amp; manage your spending
          </p>
        </div>

        {/* Server error banner */}
        {fetchError && (
          <div
            className="fade-in"
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: 'var(--red-dim)',
              border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 12,
              color: 'var(--red)',
              fontSize: '0.82rem',
              fontFamily: 'DM Mono',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span>⚠ {fetchError}</span>
            <button
              onClick={loadExpenses}
              style={{
                background: 'var(--red-dim)',
                border: '1px solid rgba(255,77,109,0.3)',
                borderRadius: 6,
                color: 'var(--red)',
                fontFamily: 'DM Mono',
                fontSize: '0.75rem',
                padding: '3px 10px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stat cards row */}
        <div
          className="fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14,
            marginBottom: 24,
            animationDelay: '0.05s',
          }}
        >
          <StatCard
            label="Total Spent"
            value={`₹${total.toLocaleString('en-IN')}`}
            sub={`across ${Object.keys(categoryTotals).length} categories`}
            accent
          />
          <StatCard
            label="Transactions"
            value={expenses.length}
            sub="expenses logged"
          />
          <StatCard
            label="Top Category"
            value={topCategory ? capitalize(topCategory[0]) : '—'}
            sub={topCategory ? `₹${topCategory[1].toLocaleString('en-IN')}` : 'no data'}
          />
          <StatCard
            label="Avg. Expense"
            value={
              expenses.length
                ? `₹${Math.round(total / expenses.length).toLocaleString('en-IN')}`
                : '—'
            }
            sub="per transaction"
          />
        </div>

        {/* Two-column grid: left = chart + input | right = expense list */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 380px) 1fr',
            gap: 20,
            alignItems: 'start',
          }}
          className="responsive-grid"
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Input */}
            <ExpenseInput onExpenseAdded={loadExpenses} />

            {/* Chart card */}
            <div
              className="fade-in"
              style={{
                animationDelay: '0.2s',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 24,
              }}
            >
              <SectionHeader icon="📊" title="By Category" />
              <div style={{ marginTop: 16 }}>
                <Chart expenses={expenses} />
              </div>
            </div>
          </div>

          {/* Right column — expense list */}
          <div
            className="fade-in"
            style={{
              animationDelay: '0.15s',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            {/* Header + filter */}
            <div style={{ marginBottom: 16 }}>
              <SectionHeader icon="📋" title="All Expenses" />

              {/* Category filter tabs */}
              {categories.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginTop: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      style={{
                        fontFamily: 'DM Mono',
                        fontSize: '0.7rem',
                        padding: '4px 12px',
                        borderRadius: 6,
                        border:
                          filter === cat
                            ? '1px solid rgba(232,255,71,0.5)'
                            : '1px solid var(--border)',
                        background: filter === cat ? 'var(--accent-dim)' : 'var(--surface-2)',
                        color: filter === cat ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textTransform: 'capitalize',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ExpenseList
              expenses={filteredExpenses}
              loading={loading}
              onDeleted={loadExpenses}
            />
          </div>
        </div>
      </main>

      {/* Responsive grid style */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: accent ? 'var(--accent-dim)' : 'var(--surface)',
        border: `1px solid ${accent ? 'rgba(232,255,71,0.25)' : 'var(--border)'}`,
        borderRadius: 14,
        padding: '18px 20px',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <p
        style={{
          fontFamily: 'DM Mono',
          fontSize: '0.68rem',
          color: accent ? 'rgba(232,255,71,0.7)' : 'var(--text-muted)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'Syne',
          fontWeight: 800,
          fontSize: '1.5rem',
          letterSpacing: '-0.04em',
          color: accent ? 'var(--accent)' : 'var(--text)',
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          marginTop: 5,
          fontFamily: 'DM Mono',
          fontSize: '0.68rem',
          color: accent ? 'rgba(232,255,71,0.5)' : 'var(--text-muted)',
        }}
      >
        {sub}
      </p>
    </div>
  )
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <h3
        style={{
          fontFamily: 'Syne',
          fontWeight: 700,
          fontSize: '0.95rem',
          color: 'var(--text)',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h3>
    </div>
  )
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
