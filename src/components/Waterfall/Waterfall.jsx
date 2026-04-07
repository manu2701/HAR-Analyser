import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import styles from './Waterfall.module.css';

function getStatusClass(status) {
  if (status >= 500) return styles.status5xx;
  if (status >= 400) return styles.status4xx;
  if (status >= 300) return styles.status3xx;
  return styles.status2xx;
}

export default function Waterfall() {
  const entries = useHarStore((s) => s.entries);
  const isLoaded = useHarStore((s) => s.isLoaded);
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◎</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>Upload a HAR file to see the waterfall chart</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Go to Upload</button>
        </div>
      </div>
    );
  }

  // Find max time for scaling
  const maxTime = Math.max(...entries.map((e) => e.time));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Waterfall</h1>
        <p className={styles.subtitle}>
          Visual timing breakdown for each request — DNS, TCP, SSL, TTFB, and Download
        </p>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDns}`} /> DNS
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendTcp}`} /> TCP
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendSsl}`} /> SSL
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendTtfb}`} /> TTFB
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDownload}`} /> Download
        </span>
      </div>

      {/* Waterfall Rows */}
      <div className={styles.waterfallList}>
        {entries.map((entry) => {
          const t = entry.timings;
          const total = t.dns + t.tcp + t.ssl + t.ttfb + t.download;
          const scale = (maxTime > 0 ? entry.time / maxTime : 0) * 100;

          return (
            <div key={entry.id} className={styles.waterfallRow}>
              <div className={styles.rowUrl} title={entry.url}>
                {entry.path}
              </div>
              <div className={`${styles.rowStatus} ${getStatusClass(entry.status)}`}>
                {entry.status}
              </div>
              <div className={styles.barContainer} style={{ width: `${Math.max(scale, 5)}%` }}>
                {[
                  { key: 'dns', ms: t.dns, cls: styles.barDns },
                  { key: 'tcp', ms: t.tcp, cls: styles.barTcp },
                  { key: 'ssl', ms: t.ssl, cls: styles.barSsl },
                  { key: 'ttfb', ms: t.ttfb, cls: styles.barTtfb },
                  { key: 'download', ms: t.download, cls: styles.barDownload },
                ].map((seg) => (
                  <div
                    key={seg.key}
                    className={`${styles.barSegment} ${seg.cls}`}
                    style={{ width: `${total > 0 ? (seg.ms / total) * 100 : 0}%` }}
                    title={`${seg.key.toUpperCase()}: ${seg.ms}ms`}
                  />
                ))}
              </div>
              <div className={styles.rowTime}>{entry.time}ms</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
