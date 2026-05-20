import { titleCase } from '../lib/format';

interface StatusBadgeProps {
  value: string;
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${value}`}>{titleCase(value)}</span>;
}
