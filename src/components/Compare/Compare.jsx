import styles from './Compare.module.css';

export default function Compare() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Compare HAR Files</h1>
        <p className={styles.subtitle}>
          Upload two HAR files to compare — see new failures, removed domains, and latency regressions
        </p>
      </div>

      <div className={styles.compareGrid}>
        {/* Left Upload */}
        <div className={styles.uploadZone}>
          <div className={styles.zoneIcon}>📂</div>
          <div className={styles.zoneLabel}>HAR File A (Before)</div>
          <div className={styles.zoneSubLabel}>Drop or click to upload</div>
        </div>

        {/* VS */}
        <div className={styles.vsSection}>
          <div className={styles.vsBadge}>VS</div>
        </div>

        {/* Right Upload */}
        <div className={styles.uploadZone}>
          <div className={styles.zoneIcon}>📂</div>
          <div className={styles.zoneLabel}>HAR File B (After)</div>
          <div className={styles.zoneSubLabel}>Drop or click to upload</div>
        </div>
      </div>

      {/* Diff Placeholder */}
      <div className={styles.diffPlaceholder}>
        <div className={styles.diffIcon}>📊</div>
        <h3 className={styles.diffTitle}>Comparison Results</h3>
        <p className={styles.diffDesc}>
          Upload two HAR files above to see a detailed diff — including new failures,
          removed domains, latency changes, and status code shifts.
        </p>
      </div>
    </div>
  );
}
