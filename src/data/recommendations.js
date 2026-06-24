// Curated reduction actions shown on the branch Recommendations page.
// `saving` is in tCO2e/year; `effort` is 1–5; `scopeKey` maps to the --s1/--s2/--s3
// design tokens. `iconKey` is resolved to a Phosphor icon in the page component.
// The emission-profile sidebar is NOT defined here — it is derived from the branch's
// `breakdown` in src/data/mockBranches.js so figures stay consistent across the app.

export const BRANCH_RECOMMENDATIONS = [
  {
    id: 'rec-solar',
    category: 'Electricity',
    scopeKey: 's2',
    iconKey: 'electricity',
    title: 'Shift to a 25 kW rooftop solar installation',
    description:
      'Your electricity is your single largest source at 3.01 tCO₂e. Pune averages 5.2 peak sun hours/day — a modest rooftop array would offset roughly a third of grid draw and pays back in ~4 years.',
    match: 94,
    saving: 1.05,
    effort: 3,
    payback: '~4 years',
  },
  {
    id: 'rec-led',
    category: 'Electricity',
    scopeKey: 's2',
    iconKey: 'efficiency',
    title: 'LED retrofit + AC setpoint optimisation',
    description:
      'Switching remaining tube lights to LED and holding air-conditioning at 24–26°C trims base load with no capital project. Each degree lower adds ~6% to the cooling bill.',
    match: 90,
    saving: 0.21,
    effort: 1,
    payback: '< 1 year',
  },
  {
    id: 'rec-rail',
    category: 'Business Travel',
    scopeKey: 's3',
    iconKey: 'travel',
    title: 'Switch short-haul flights to rail for trips under 700 km',
    description:
      'Two of your logged flights were on routes with direct rail alternatives. Rail emits roughly 95% less per passenger-km than domestic air on these corridors.',
    match: 91,
    saving: 0.52,
    effort: 2,
    payback: 'Cost-neutral',
  },
  {
    id: 'rec-dg',
    category: 'DG Set',
    scopeKey: 's1',
    iconKey: 'dg',
    title: 'Cut diesel generator runtime with a grid-backup audit',
    description:
      'Your DG set contributed 0.48 tCO₂e. Much of this is avoidable — scheduling non-critical loads around grid availability and servicing the set for efficiency typically cuts runtime 30–40%.',
    match: 88,
    saving: 0.17,
    effort: 1,
    payback: 'Immediate',
  },
  {
    id: 'rec-paper',
    category: 'Paper & Waste',
    scopeKey: 's3',
    iconKey: 'paper',
    title: 'Move to digital working papers & duplex-default printing',
    description:
      'A CA branch is paper-heavy by nature. Setting duplex as the printer default and digitising routine working papers typically halves paper consumption within a quarter.',
    match: 85,
    saving: 0.08,
    effort: 1,
    payback: 'Immediate',
  },
]

export const GENERAL_TIPS = [
  'Set air-conditioning to 24–26°C — each degree lower adds ~6% to cooling load.',
  'Switch to 5-star rated appliances and LED lighting at next replacement.',
  'Enable power-management on all desktops and shared printers.',
  'Consolidate travel and prefer virtual meetings where practical.',
]

// Category metadata for the emission-profile sidebar (keys match branch `breakdown`).
export const PROFILE_META = {
  electricity: { label: 'Electricity', scopeKey: 's2' },
  dg: { label: 'DG Set', scopeKey: 's1' },
  travel: { label: 'Travel', scopeKey: 's3' },
  cooking: { label: 'Cooking', scopeKey: 's1' },
  paper: { label: 'Paper & Waste', scopeKey: 's3' },
  hotel: { label: 'Hotel Stays', scopeKey: 's3' },
}
