import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const LABEL_COLORS = [
  { name: 'Green', value: '#61bd4f' },
  { name: 'Yellow', value: '#f2d600' },
  { name: 'Orange', value: '#ff9f1a' },
  { name: 'Red', value: '#eb5a46' },
  { name: 'Purple', value: '#c377e0' },
  { name: 'Blue', value: '#0079bf' },
  { name: 'Sky', value: '#00c2e0' },
  { name: 'Lime', value: '#51e898' },
  { name: 'Pink', value: '#ff78cb' },
  { name: 'Black', value: '#344563' },
];

export function isOverdue(dueDate: string | Date): boolean {
  return new Date(dueDate) < new Date();
}

export function isDueSoon(dueDate: string | Date, hours: number = 24): boolean {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return diff > 0 && diff < hours * 60 * 60 * 1000;
}
