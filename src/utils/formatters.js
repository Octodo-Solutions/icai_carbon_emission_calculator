export function fmtTco2e(value, decimals = 3) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return parseFloat(value).toFixed(decimals)
}

export function fmtTco2eLabel(value) {
  if (!value && value !== 0) return '—'
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return parseFloat(value).toFixed(3)
}

export function fmtNumber(n) {
  if (n === null || n === undefined) return '—'
  return Number(n).toLocaleString('en-IN')
}

export function fmtPercent(val, total) {
  if (!total) return '0%'
  return `${Math.round((val / total) * 100)}%`
}

export function scopeLabel(scope) {
  const map = { 1: 'Scope 1', 2: 'Scope 2', 3: 'Scope 3' }
  return map[scope] || `Scope ${scope}`
}

export function statusLabel(status) {
  const map = {
    approved: 'Approved',
    pending: 'Pending Approval',
    'in-progress': 'In Progress',
    overdue: 'Overdue',
    pending_regional: 'Awaiting Regional Review',
    pending_ho: 'Awaiting HO Review',
  }
  return map[status] || status
}

export function statusColor(status) {
  const map = {
    approved: 'var(--green)',
    pending: 'var(--amber)',
    'in-progress': 'var(--amber)',
    overdue: 'var(--red)',
    pending_regional: 'var(--amber)',
  }
  return map[status] || 'var(--text-2)'
}
