import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import styles from './Identity.module.css';

const stepIcons = ['👤', '🌐', '🔐', '↩️', '🔑', '✅'];

export default function Identity() {
  const identityFlow = useHarStore((s) => s.identityFlow);
  const isLoaded = useHarStore((s) => s.isLoaded);
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔐</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>Upload a HAR file to trace the identity flow</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Go to Upload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Identity Flow</h1>
        <p className={styles.subtitle}>SAML/OAuth authentication trace extracted from HAR traffic</p>
      </div>

      {/* Horizontal Flow */}
      <div className={styles.flowContainer}>
        {identityFlow.map((step, i) => (
          <div key={step.step} className={styles.flowStep}>
            <div className={`${styles.node} ${step.status === 'completed' ? styles.nodeCompleted : ''}`}>
              {step.status === 'completed' && <div className={styles.nodeStatusDot} />}
              <div className={styles.nodeIcon}>{stepIcons[i] || '📌'}</div>
              <div className={styles.nodeStep}>Step {step.step}</div>
              <div className={styles.nodeLabel}>{step.label}</div>
              <div className={styles.nodeProvider}>{step.provider}</div>
            </div>
            {i < identityFlow.length - 1 && (
              <div className={styles.arrow}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Cards */}
      <div className={styles.detailSection}>
        <h2 className={styles.detailTitle}>Flow Details</h2>
        <div className={styles.detailGrid}>
          {identityFlow.map((step, i) => (
            <div key={step.step} className={styles.detailCard}>
              <div className={styles.detailCardStep}>Step {step.step} — {step.provider}</div>
              <div className={styles.detailCardLabel}>{step.label}</div>
              <p className={styles.detailCardDesc}>{step.description}</p>
              <div className={styles.detailCardUrl}>{step.url}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
