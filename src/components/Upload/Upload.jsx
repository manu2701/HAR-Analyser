import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import { loadDemoData, parseHarFile } from '../../services/api';
import styles from './Upload.module.css';

const featureBadges = [
  { icon: '🧠', label: 'AI-Powered Summary' },
  { icon: '🔒', label: '100% In-Browser' },
  { icon: '🔑', label: 'SAML/OAuth Detection' },
  { icon: '✨', label: 'Wildcard Suggestions' },
  { icon: '📊', label: 'Health Score' },
  { icon: '🔄', label: 'HAR Comparison' },
];

const featureCards = [
  {
    icon: '📊',
    title: 'Request Health Score',
    description:
      'Auto-grades your HAR from A+ to F based on error rate, latency, security headers, and CORS issues. Instant executive summary.',
  },
  {
    icon: '🔄',
    title: 'HAR Comparison Mode',
    description:
      'Upload two HAR files and see exactly what changed — new failures, removed domains, latency regressions. Before vs after any change.',
  },
  {
    icon: '🔍',
    title: 'Smart Search Engine',
    description:
      'Type "show 403 from atlassian" or "slow requests from CDN" and get instant filtered results. Natural language query over HAR data.',
  },
  {
    icon: '📋',
    title: 'Ticket-Ready Summary',
    description:
      'One-click export of a formatted Jira/ServiceNow ticket with all findings, affected domains, suggested fixes, and HAR metadata.',
  },
  {
    icon: '📖',
    title: 'Playbook Matching',
    description:
      'Detects known Prisma Access failure patterns and links directly to the internal runbook for that issue. Reduces MTTR for repeat problems.',
  },
  {
    icon: '📈',
    title: 'Latency Percentiles',
    description:
      'Shows P50/P90/P95/P99 latency per domain, not just averages. Catches tail latency problems that averages hide. Critical for SaaS debugging.',
  },
];

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const loadMockData = useHarStore((s) => s.loadMockData);

  const handleLoadDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadDemoData();
      loadMockData(data);
      navigate('/requests');
    } catch (err) {
      console.error('Failed to load demo:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadMockData, navigate]);

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file || !file.name.endsWith('.har')) {
        alert('Please upload a valid .har file');
        return;
      }
      setIsLoading(true);
      try {
        const data = await parseHarFile(file);
        loadMockData(data);
        navigate('/requests');
      } catch (err) {
        console.error('Failed to parse HAR:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadMockData, navigate]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.heroSection}>
        <p className={styles.subtitle}>
          <span className={styles.subtitleAccent}>PRISMA ACCESS</span> · INTERNAL
          INTELLIGENCE TOOL
        </p>
        <h1 className={styles.title}>
          Drop a HAR file.
          <br />
          <span className={styles.titleGradient}>Understand what broke.</span>
        </h1>
        <p className={styles.description}>
          Not a HAR viewer — an intelligent assistant that explains failures, detects
          identity issues, maps SaaS dependencies, and tells you exactly what to fix.
        </p>
      </section>

      {/* Drop Zone */}
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Analyzing HAR file…</p>
        </div>
      ) : (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.dropIcon}>📂</div>
          <p className={styles.dropTitle}>Drag & drop your HAR file here</p>
          <p className={styles.dropSubtitle}>
            All processing happens in your browser — no data leaves this page
          </p>
          <div className={styles.dropActions}>
            <button
              className={styles.uploadBtn}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Upload HAR File
            </button>
            <button
              className={styles.demoBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleLoadDemo();
              }}
              disabled={isLoading}
            >
              ⚡ Load Demo HAR
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".har"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Feature Badges */}
      <div className={styles.badgeRow}>
        {featureBadges.map((badge) => (
          <span key={badge.label} className={styles.featureBadge}>
            {badge.icon} {badge.label}
          </span>
        ))}
      </div>

      {/* Feature Cards */}
      <section className={styles.featuresSection}>
        <p className={styles.featuresSubtitle}>WHAT MAKES THIS DIFFERENT</p>
        <h2 className={styles.featuresTitle}>
          Features that will get you converted
        </h2>
        <div className={styles.featuresGrid}>
          {featureCards.map((card) => (
            <div key={card.title} className={styles.featureCard}>
              <div className={styles.featureCardIcon}>{card.icon}</div>
              <h3 className={styles.featureCardTitle}>{card.title}</h3>
              <p className={styles.featureCardDesc}>{card.description}</p>
              <span className={styles.featureCardLink}>Extra Feature →</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
