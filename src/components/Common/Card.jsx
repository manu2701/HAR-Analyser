import styles from './Card.module.css';

export default function Card({
  children,
  className = '',
  glow = false,
  hover = true,
  padding = 'md',
  onClick,
}) {
  const classes = [
    styles.card,
    glow ? styles.glow : '',
    hover ? styles.hover : '',
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
}
