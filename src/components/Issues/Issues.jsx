import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import Badge from '../Common/Badge';
import styles from './Issues.module.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'error', label: 'Errors' },
  { key: 'warning', label: 'Warnings' },
  { key: 'info', label: 'Info' },
];

const typeConfig = {
  error: { icon: '🔴', badgeType: 'error', label: 'Error', className: styles.iconError },
  warning: { icon: '🟡', badgeType: 'warning', label: 'Warning', className: styles.iconWarning },
  info: { icon: '🔵', badgeType: 'info', label: 'Info', className: styles.iconInfo },
};

export default function Issues() {
  const issues = useHarStore((s) => s.issues);
  const isLoaded = useHarStore((s) => s.isLoaded);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return issues;
    return issues.filter((i) => i.type === activeFilter);
  }, [issues, activeFilter]);

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔥</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>Upload a HAR file to see detected issues</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Go to Upload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Issues ({issues.length})</h1>
          <p className={styles.subtitle}>Detected problems and suggested fixes</p>
        </div>
        <div className={styles.filterGroup}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${activeFilter === f.key ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.issueList}>
        {filtered.map((issue) => {
          const cfg = typeConfig[issue.type];
          return (
            <div key={issue.id} className={styles.issueCard}>
              <div className={styles.issueHeader}>
                <div className={`${styles.issueIcon} ${cfg.className}`}>{cfg.icon}</div>
                <span className={styles.issueTitle}>{issue.title}</span>
                <span className={styles.issueBadge}>
                  <Badge type={cfg.badgeType}>{cfg.label}</Badge>
                </span>
              </div>
              <p className={styles.issueDesc}>{issue.description}</p>
              <div className={styles.issueFix}>
                <div className={styles.issueFixLabel}>Suggested Fix</div>
                {issue.fix}
              </div>
              <p className={styles.issueUrl}>{issue.affectedUrl}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
