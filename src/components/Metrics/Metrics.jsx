import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import styles from './Metrics.module.css';

const statusColors = {
  '2xx': 'var(--success-400)',
  '3xx': 'var(--warning-400)',
  '4xx': 'var(--error-400)',
  '5xx': '#f87171',
};

const fillClasses = {
  '2xx': styles.fill2xx,
  '3xx': styles.fill3xx,
  '4xx': styles.fill4xx,
  '5xx': styles.fill5xx,
};

export default function Metrics() {
  const metrics = useHarStore((s) => s.metrics);
  const isLoaded = useHarStore((s) => s.isLoaded);
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>Upload a HAR file to see metrics</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Go to Upload</button>
        </div>
      </div>
    );
  }

  const maxStatusCount = Math.max(...Object.values(metrics.statusDistribution || {}), 1);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Metrics</h1>
        <p className={styles.subtitle}>Performance overview and key statistics</p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Requests</div>
          <div className={styles.statValue}>{metrics.totalRequests}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Error Rate</div>
          <div className={`${styles.statValue} ${styles.statValueError}`}>
            {metrics.errorRate}<span className={styles.statUnit}>%</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Latency</div>
          <div className={`${styles.statValue} ${styles.statValueSuccess}`}>
            {metrics.avgLatency}<span className={styles.statUnit}>ms</span>
          </div>
        </div>
      </div>

      {/* Two Column */}
      <div className={styles.twoCol}>
        {/* Slowest Requests */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Slowest Requests</h3>
          <div className={styles.slowList}>
            {(metrics.slowestRequests || []).map((req, i) => (
              <div key={req.id} className={styles.slowItem}>
                <span className={styles.slowRank}>#{i + 1}</span>
                <span className={styles.slowPath} title={req.path}>{req.path}</span>
                <span className={styles.slowTime}>{req.time}ms</span>
                <span
                  className={styles.slowStatus}
                  style={{ color: req.status >= 400 ? 'var(--error-400)' : 'var(--text-tertiary)' }}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Status Distribution</h3>
          <div className={styles.statusList}>
            {Object.entries(metrics.statusDistribution || {}).map(([bucket, count]) => (
              <div key={bucket} className={styles.statusRow}>
                <span className={styles.statusLabel} style={{ color: statusColors[bucket] }}>
                  {bucket}
                </span>
                <div className={styles.statusBarBg}>
                  <div
                    className={`${styles.statusBarFill} ${fillClasses[bucket]}`}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
                <span className={styles.statusCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latency Percentiles */}
      <div className={styles.percentilesSection}>
        <h3 className={styles.sectionTitle}>Latency Percentiles</h3>
        <div className={styles.percentilesGrid}>
          {[
            { label: 'P50', value: metrics.p50Latency },
            { label: 'P90', value: metrics.p90Latency },
            { label: 'P95', value: metrics.p95Latency },
            { label: 'P99', value: metrics.p99Latency },
          ].map((p) => (
            <div key={p.label} className={styles.percentileCard}>
              <div className={styles.percentileLabel}>{p.label}</div>
              <div className={styles.percentileValue}>{p.value}ms</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
