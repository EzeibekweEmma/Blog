const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th'; // Covers 11-20
  const suffixes = ['st', 'nd', 'rd'];
  return suffixes[(day % 10) - 1] || 'th';
};

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getUTCFullYear();

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

export const timeAgo = (createdDate: Date, locale = 'en') => {
  const date = new Date(createdDate);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
  const thresholds = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(thresholds)) {
    if (Math.abs(seconds) >= value) {
      const delta = Math.round(seconds / value);
      return rtf.format(delta, unit as Intl.RelativeTimeFormatUnit);
    }
  }
  return rtf.format(seconds, 'second');
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return num.toString();
};
