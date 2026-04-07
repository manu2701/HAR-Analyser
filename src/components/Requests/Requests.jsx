import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import styles from './Requests.module.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: '2xx', label: '2xx' },
  { key: '3xx', label: '3xx' },
  { key: '4xx', label: '4xx' },
  { key: '5xx', label: '5xx' },
  { key: 'slow', label: 'Slow (>1s)' },
  { key: 'issues', label: 'Issues' },
];

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getMethodClass(method) {
  const map = {
    GET: styles.methodGet,
    POST: styles.methodPost,
    PUT: styles.methodPut,
    DELETE: styles.methodDelete,
    OPTIONS: styles.methodOptions,
  };
  return map[method] || styles.methodGet;
}

function getStatusClass(status) {
  if (status >= 500) return styles.status5xx;
  if (status >= 400) return styles.status4xx;
  if (status >= 300) return styles.status3xx;
  return styles.status2xx;
}

export default function Requests() {
  const entries = useHarStore((s) => s.entries);
  const summary = useHarStore((s) => s.summary);
  const isLoaded = useHarStore((s) => s.isLoaded);
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filteredEntries = useMemo(() => {
    let result = entries;

    // Apply filter
    switch (activeFilter) {
      case '2xx':
        result = result.filter((e) => e.status >= 200 && e.status < 300);
        break;
      case '3xx':
        result = result.filter((e) => e.status >= 300 && e.status < 400);
        break;
      case '4xx':
        result = result.filter((e) => e.status >= 400 && e.status < 500);
        break;
      case '5xx':
        result = result.filter((e) => e.status >= 500);
        break;
      case 'slow':
        result = result.filter((e) => e.time > 1000);
        break;
      case 'issues':
        result = result.filter((e) => e.hasIssues);
        break;
      default:
        break;
    }

    // Apply search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.url.toLowerCase().includes(query) ||
          e.method.toLowerCase().includes(query) ||
          String(e.status).includes(query)
      );
    }

    return result;
  }, [entries, activeFilter, search]);

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>
            Upload a HAR file or load a demo to see request analysis
          </p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Summary Bar */}
      <div className={styles.summaryBar}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Requests</div>
          <div className={styles.statValue}>{summary.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Errors</div>
          <div className={`${styles.statValue} ${styles.statValueError}`}>
            {summary.errors}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Redirects</div>
          <div className={`${styles.statValue} ${styles.statValueWarning}`}>
            {summary.redirects}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Time</div>
          <div className={`${styles.statValue} ${styles.statValueSuccess}`}>
            {summary.avgTime}ms
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${
                activeFilter === f.key ? styles.filterBtnActive : ''
              }`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by URL, method, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className={styles.resultsCount}>
        Showing {filteredEntries.length} of {entries.length} requests
      </p>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Method</th>
              <th>URL</th>
              <th>Status</th>
              <th>Size</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className={selectedEntry?.id === entry.id ? styles.selectedRow : ''}
              >
                <td>
                  <span className={`${styles.methodBadge} ${getMethodClass(entry.method)}`}>
                    {entry.method}
                  </span>
                </td>
                <td className={styles.urlCell}>
                  <div className={styles.urlDomain}>{entry.domain}</div>
                  <div className={styles.urlPath}>{entry.path}</div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(entry.status)}`}>
                    {entry.status}
                  </span>
                  {entry.hasIssues && <span className={styles.issueIcon}> ⚠️</span>}
                </td>
                <td className={styles.sizeCell}>{formatSize(entry.size)}</td>
                <td>
                  <span
                    className={`${styles.timeCell} ${
                      entry.time > 1000 ? styles.timeSlow : styles.timeNormal
                    }`}
                  >
                    {entry.time}ms
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {selectedEntry && (
        <>
          <div className={styles.overlay} onClick={() => setSelectedEntry(null)} />
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Request Detail</span>
              <button
                className={styles.drawerClose}
                onClick={() => setSelectedEntry(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.drawerContent}>
              {/* Overview */}
              <div className={styles.drawerSection}>
                <h3 className={styles.drawerSectionTitle}>Overview</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Method</span>
                  <span className={styles.detailValue}>{selectedEntry.method}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>
                    {selectedEntry.status} {selectedEntry.statusText}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>URL</span>
                  <span className={styles.detailValue}>{selectedEntry.url}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Type</span>
                  <span className={styles.detailValue}>{selectedEntry.type}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Size</span>
                  <span className={styles.detailValue}>
                    {formatSize(selectedEntry.size)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Total Time</span>
                  <span className={styles.detailValue}>{selectedEntry.time}ms</span>
                </div>
              </div>

              {/* Timing Breakdown */}
              <div className={styles.drawerSection}>
                <h3 className={styles.drawerSectionTitle}>Timing Breakdown</h3>
                <div className={styles.timingBar}>
                  {Object.entries(selectedEntry.timings).map(([phase, ms]) => {
                    const total = Object.values(selectedEntry.timings).reduce(
                      (a, b) => a + b,
                      0
                    );
                    const pct = (ms / total) * 100;
                    const classMap = {
                      dns: styles.timingDns,
                      tcp: styles.timingTcp,
                      ssl: styles.timingSsl,
                      ttfb: styles.timingTtfb,
                      download: styles.timingDownload,
                    };
                    return (
                      <div
                        key={phase}
                        className={`${styles.timingSegment} ${classMap[phase]}`}
                        style={{ width: `${Math.max(pct, 1)}%` }}
                        title={`${phase.toUpperCase()}: ${ms}ms`}
                      />
                    );
                  })}
                </div>
                <div className={styles.timingLegend}>
                  {Object.entries(selectedEntry.timings).map(([phase, ms]) => {
                    const colors = {
                      dns: 'var(--purple-400)',
                      tcp: 'var(--orange-400)',
                      ssl: 'var(--warning-400)',
                      ttfb: 'var(--success-400)',
                      download: 'var(--primary-400)',
                    };
                    return (
                      <span key={phase} className={styles.timingLegendItem}>
                        <span
                          className={styles.timingLegendDot}
                          style={{ background: colors[phase] }}
                        />
                        {phase.toUpperCase()} {ms}ms
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Request Headers */}
              {selectedEntry.requestHeaders?.length > 0 && (
                <div className={styles.drawerSection}>
                  <h3 className={styles.drawerSectionTitle}>Request Headers</h3>
                  <table className={styles.headerTable}>
                    <tbody>
                      {selectedEntry.requestHeaders.map((h, i) => (
                        <tr key={i}>
                          <td className={styles.headerName}>{h.name}</td>
                          <td className={styles.headerValue}>{h.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Response Headers */}
              {selectedEntry.responseHeaders?.length > 0 && (
                <div className={styles.drawerSection}>
                  <h3 className={styles.drawerSectionTitle}>Response Headers</h3>
                  <table className={styles.headerTable}>
                    <tbody>
                      {selectedEntry.responseHeaders.map((h, i) => (
                        <tr key={i}>
                          <td className={styles.headerName}>{h.name}</td>
                          <td className={styles.headerValue}>{h.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
