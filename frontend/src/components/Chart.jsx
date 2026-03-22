import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const PALETTE = [
  '#e8ff47', '#4fc3f7', '#ba68c8', '#ffb74d',
  '#81c784', '#f06292', '#4dd0e1', '#fff176',
  '#ff8a65', '#a5d6a7',
]

export default function Chart({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 220,
          gap: 10,
        }}
      >
        <div style={{ fontSize: 36 }}>📊</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'DM Mono' }}>
          No data to chart yet
        </p>
      </div>
    )
  }

  // Aggregate by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = (exp.category || 'other').toLowerCase()
    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0)
    return acc
  }, {})

  const labels = Object.keys(categoryTotals)
  const values = Object.values(categoryTotals)
  const total = values.reduce((a, b) => a + b, 0)
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length])

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.map((c) => c + '33'), // 20% opacity fill
        borderColor: colors,
        borderWidth: 2,
        hoverBackgroundColor: colors.map((c) => c + '66'),
        hoverBorderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a24',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        titleFont: { family: 'Syne', weight: '600', size: 13 },
        bodyFont: { family: 'DM Mono', size: 12 },
        titleColor: '#f0f0f5',
        bodyColor: '#9e9eb5',
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed
            const pct = ((val / total) * 100).toFixed(1)
            return ` ₹${val.toLocaleString('en-IN')} (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div>
      {/* Doughnut */}
      <div style={{ position: 'relative', height: 220 }}>
        <Doughnut data={data} options={options} />
        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <p style={{ fontFamily: 'DM Mono', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            TOTAL
          </p>
          <p
            style={{
              fontFamily: 'Syne',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--accent)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Custom legend */}
      <div
        style={{
          marginTop: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '8px',
        }}
      >
        {labels.map((label, i) => {
          const pct = ((categoryTotals[label] / total) * 100).toFixed(0)
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                background: 'var(--surface-2)',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: colors[i],
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    color: 'var(--text)',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'DM Mono',
                    color: 'var(--text-muted)',
                  }}
                >
                  {pct}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
