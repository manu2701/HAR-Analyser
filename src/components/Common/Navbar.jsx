import { NavLink, useLocation } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import styles from './Navbar.module.css';

const tabs = [
  { path: '/', label: 'Upload', icon: '📁' },
  { path: '/requests', label: 'Requests', icon: '📋' },
  { path: '/issues', label: 'Issues', icon: '🔥' },
  { path: '/waterfall', label: 'Waterfall', icon: '◎' },
  { path: '/domains', label: 'Domains', icon: '🌐' },
  { path: '/identity', label: 'Identity Flow', icon: '🔐' },
  { path: '/ai', label: 'AI Assistant', icon: '🤖' },
  { path: '/metrics', label: 'Metrics', icon: '📊' },
  { path: '/compare', label: 'Compare', icon: '🔄' },
];

export default function Navbar() {
  const isLoaded = useHarStore((s) => s.isLoaded);
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.brandDot} />
          HAR·Analyzer·Pro
        </NavLink>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `${styles.tab} ${isActive ? styles.tabActive : ''}`
              }
              end={tab.path === '/'}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className={styles.navActions}>
          {isLoaded && (
            <span className={styles.statusBadge}>
              <span className={styles.statusDot} />
              Ready
            </span>
          )}
          <button className={styles.exportBtn}>
            📥 Export
          </button>
        </div>
      </div>
    </nav>
  );
}
