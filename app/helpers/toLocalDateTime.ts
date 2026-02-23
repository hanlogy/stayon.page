export function toLocalDateTime(date: Date) {
  return date.toLocaleString([], {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function toLocalTime(date: Date) {
  return date.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
