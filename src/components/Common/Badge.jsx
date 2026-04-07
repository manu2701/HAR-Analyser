import styles from './Badge.module.css';

const typeClassMap = {
  success: styles.success,
  error: styles.error,
  warning: styles.warning,
  info: styles.info,
  primary: styles.primary,
  neutral: styles.neutral,
  api: styles.api,
  cdn: styles.cdn,
  auth: styles.auth,
  analytics: styles.analytics,
};

export default function Badge({ children, type = 'neutral', size = 'sm', dot = false }) {
  return (
    <span className={`${styles.badge} ${typeClassMap[type] || styles.neutral} ${styles[size]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
