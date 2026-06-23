import Tooltip from '../Tooltip/Tooltip'
import styles from './EfChip.module.css'

export default function EfChip({ factor }) {
  if (!factor) return null
  return (
    <div className={styles.chip}>
      <span className={styles.label}>
        {factor.source}: {factor.displayValue} {factor.unit}
      </span>
      <Tooltip
        title="EMISSION FACTOR"
        content={`Source: ${factor.source}. Effective from ${factor.effectiveFrom}. Version ${factor.versions?.[0] ? 'v' + factor.versions.length : 'v1'} (current). All calculations use the factor active at time of data entry.`}
        anchor={`GHG Protocol / ${factor.source} standard`}
      />
    </div>
  )
}
