import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import Badge from '../Common/Badge';
import styles from './Domains.module.css';

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getStatusColor(status) {
  if (status >= 500) return 'var(--error-400)';
  if (status >= 400) return 'var(--error-400)';
  if (status >= 300) return 'var(--warning-400)';
  return 'var(--success-400)';
}

export default function Domains() {
  const domains = useHarStore((s) => s.domains);
  const isLoaded = useHarStore((s) => s.isLoaded);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🌐</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>Upload a HAR file to see domain analysis</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Go to Upload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Domains ({domains.length})</h1>
        <p className={styles.subtitle}>Breakdown by domain with request counts and types</p>
      </div>

      <div className={styles.grid}>
        {domains.map((dom) => (
          <div
            key={dom.id}
            className={styles.domainCard}
            onClick={() => setExpanded(expanded === dom.id ? null : dom.id)}
          >
            <div className={styles.cardHeader}>
              <span className={styles.domainName}>{dom.domain}</span>
              <Badge type={dom.type.toLowerCase()}>{dom.type}</Badge>
            </div>

            <div className={styles.cardStats}>
              <div className={styles.cardStat}>
                <div className={styles.cardStatValue}>{dom.requestCount}</div>
                <div className={styles.cardStatLabel}>Requests</div>
              </div>
              <div className={styles.cardStat}>
                <div className={styles.cardStatValue}>{dom.avgTime}ms</div>
                <div className={styles.cardStatLabel}>Avg Time</div>
              </div>
              <div className={styles.cardStat}>
                <div className={styles.cardStatValue}>{formatSize(dom.totalSize)}</div>
                <div className={styles.cardStatLabel}>Total Size</div>
              </div>
            </div>

            {expanded === dom.id && dom.requests && (
              <div className={styles.requestsList}>
                {dom.requests.map((req) => (
                  <div key={req.id} className={styles.requestItem}>
                    <span className={styles.requestPath} title={req.path}>{req.path}</span>
                    <span className={styles.requestStatus} style={{ color: getStatusColor(req.status) }}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Wildcard Suggestion Placeholder */}
      <div className={styles.wildcardSection}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>✨</div>
        <h3 className={styles.wildcardTitle}>Wildcard Suggestions</h3>
        <p className={styles.wildcardDesc}>
          Wildcard domain analysis will appear here when connected to the backend.
          This feature identifies common domain patterns for consolidation.
        </p>
      </div>
    </div>
  );
}
