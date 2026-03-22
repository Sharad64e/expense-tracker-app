import { useState } from 'react'
import { deleteExpense } from '../api'

// Pastel palette per category
const CATEGORY_COLORS = {
  food:          { bg: 'rgba(255,183,77,0.12)',  border: 'rgba(255,183,77,0.3)',  text: '#ffb74d', emoji: '🍽️' },
  transport:     { bg: 'rgba(79,195,247,0.12)',  border: 'rgba(79,195,247,0.3)',  text: '#4fc3f7', emoji: '🚌' },
  shopping:      { bg: 'rgba(186,104,200,0.12)', border: 'rgba(186,104,200,0.3)', text: '#ba68c8', emoji: '🛍️' },
  entertainment: { bg: 'rgba(129,199,132,0.12)', border: 'rgba(129,199,132,0.3)', text: '#81c784', emoji: '🎬' },
  health:        { bg: 'rgba(240,98,146,0.12)',  border: 'rgba(240,98,146,0.3)',  text: '#f06292', emoji: '💊' },
  utilities:     { bg: 'rgba(77,208,225,0.12)',  border: 'rgba(77,208,225,0.3)',  text: '#4dd0e1', emoji: '💡' },
  education:     { bg: 'rgba(255,241,118,0.12)', border: 'rgba(255,241,118,0.3)', text: '#fff176', emoji: '📚' },
  other:         { bg: 'rgba(120,120,140,0.12)', border: 'rgba(120,120,140,0.3)', text: '#9e9eb5', emoji: '📌' },
}

function getCategoryStyle(category) {
  const key = (category || 'other').toLowerCase()
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.other
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ExpenseList({ expenses, loading, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async (id) => {
    setDeletingId(id)
    setDeleteError('')
    try {
      await deleteExpense(id)
      onDeleted()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message
      setDeleteError(msg || 'Failed to delete. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <PulseRows />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'DM Mono' }}>
            Fetching expenses...
          </p>
        </div>
      </div>
    )
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div
        style={{
          padding: '50px 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 40 }}>🪙</div>
        <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem' }}>
          No expenses yet
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'DM Mono' }}>
          Add one above to get started
        </p>
      </div>
    )
  }

  return (
    <div>
      {deleteError && (
        <div
          className="slide-in"
          style={{
            marginBottom: 12,
            padding: '8px 14px',
            background: 'var(--red-dim)',
            border: '1px solid rgba(255,77,109,0.25)',
            borderRadius: '8px',
            color: 'var(--red)',
            fontSize: '0.78rem',
            fontFamily: 'DM Mono',
          }}
        >
          ⚠ {deleteError}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {expenses.map((exp, i) => {
          const cat = getCategoryStyle(exp.category)
          const isDeleting = deletingId === (exp._id || exp.id)
          return (
            <div
              key={exp._id || exp.id || i}
              className="slide-in"
              style={{
                animationDelay: `${i * 0.04}s`,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: isDeleting ? 0.4 : 1,
                transition: 'opacity 0.25s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) e.currentTarget.style.borderColor = 'rgba(232,255,71,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              {/* Category badge */}
              <div
                style={{
                  flexShrink: 0,
                  width: 38,
                  height: 38,
                  background: cat.bg,
                  border: `1px solid ${cat.border}`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {cat.emoji}
              </div>

              {/* Title + category */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {exp.title || exp.text || 'Untitled'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'DM Mono',
                      color: cat.text,
                      background: cat.bg,
                      border: `1px solid ${cat.border}`,
                      borderRadius: 4,
                      padding: '1px 7px',
                    }}
                  >
                    {exp.category || 'other'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>
                    {formatDate(exp.date || exp.createdAt)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p
                  style={{
                    fontFamily: 'DM Mono',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  ₹{Number(exp.amount).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(exp._id || exp.id)}
                disabled={isDeleting}
                title="Delete expense"
                style={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '8px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s',
                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.background = 'var(--red-dim)'
                    e.currentTarget.style.borderColor = 'rgba(255,77,109,0.3)'
                    e.currentTarget.style.color = 'var(--red)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                {isDeleting ? '...' : '✕'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PulseRows() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            height: 66,
            background: 'var(--surface-2)',
            borderRadius: 12,
            animation: `pulse 1.5s ease-in-out ${n * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
