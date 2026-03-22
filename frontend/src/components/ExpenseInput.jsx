import { useState } from 'react'
import { addExpense } from '../api'

export default function ExpenseInput({ onExpenseAdded }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validate = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return 'Please enter something like "Coffee 150"'
    const parts = trimmed.split(/\s+/)
    if (parts.length < 2) return 'Format: "Item Amount" — e.g. "Lunch 200"'
    const amount = parseFloat(parts[parts.length - 1])
    if (isNaN(amount) || amount <= 0) return 'Last word must be a valid positive amount'
    return null
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess(false)

    const validationError = validate(input)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await addExpense(input.trim())
      setInput('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onExpenseAdded()
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message
      setError(msg || 'Failed to add expense. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
    if (error) setError('')
  }

  return (
    <div className="fade-in" style={{ animationDelay: '0.1s' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(232,255,71,0.3)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 18 }}>+</span>
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'Syne',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--text)',
                letterSpacing: '-0.02em',
              }}
            >
              Add Expense
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>
              Type item &amp; amount — e.g.{' '}
              <span style={{ color: 'var(--accent)', fontFamily: 'DM Mono' }}>Lunch 250</span>
            </p>
          </div>
        </div>

        {/* Input row */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="Coffee 80"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: `1px solid ${error ? 'var(--red)' : success ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '12px 16px',
                color: 'var(--text)',
                fontFamily: 'DM Mono',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: error
                  ? '0 0 0 3px rgba(255,77,109,0.1)'
                  : success
                  ? '0 0 0 3px rgba(232,255,71,0.1)'
                  : 'none',
              }}
              onFocus={(e) => {
                if (!error && !success)
                  e.target.style.borderColor = 'rgba(232,255,71,0.5)'
              }}
              onBlur={(e) => {
                if (!error && !success)
                  e.target.style.borderColor = 'var(--border)'
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? 'var(--surface-2)' : 'var(--accent)',
              color: loading || !input.trim() ? 'var(--text-muted)' : '#0a0a0f',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 22px',
              fontFamily: 'Syne',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim())
                e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Spinner /> Adding...
              </span>
            ) : success ? (
              '✓ Added'
            ) : (
              'Add →'
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="slide-in"
            style={{
              marginTop: 10,
              padding: '8px 14px',
              background: 'var(--red-dim)',
              border: '1px solid rgba(255,77,109,0.25)',
              borderRadius: '8px',
              color: 'var(--red)',
              fontSize: '0.78rem',
              fontFamily: 'DM Mono',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>⚠</span> {error}
          </div>
        )}

        {/* Hint */}
        <p
          style={{
            marginTop: 14,
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontFamily: 'DM Mono',
          }}
        >
          Tip: Press{' '}
          <kbd
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: '0.7rem',
            }}
          >
            Enter
          </kbd>{' '}
          to add quickly
        </p>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
