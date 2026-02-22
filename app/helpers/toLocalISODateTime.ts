export function toLocalISODateTime(input: Date): {
  time: string;
  date: string;
  dateTime: string;
} {
  const localDateTime = input
    // use sv-SE format, which is YYYY-MM-DD HH:mm:ss
    .toLocaleString('sv-SE', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .split(' ');

  const [year, ...dateRest] = localDateTime[0].split('-');
  const dateText = [year.padStart(4, '0'), ...dateRest].join('-');

  const timeText = localDateTime[1];

  return {
    date: dateText,
    time: timeText,
    dateTime: [dateText, timeText].join('T'),
  };
}
