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

export const getDaysAgo = (createdAt: Date) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const differenceInTime = now.getTime() - createdDate.getTime();
  const differenceInDays = Math.floor(
    differenceInTime / (1000 * 60 * 60 * 24)
  );

  const res =
    differenceInTime < 1000 * 60
      ? 'Just now'
      : differenceInTime < 1000 * 60 * 60
        ? Math.floor(differenceInTime / (1000 * 60)) + ' minutes ago'
        : differenceInDays < 1
          ? Math.floor(differenceInTime / (1000 * 60 * 60)) + ' hours ago'
          : differenceInDays > 1
            ? 'A day ago'
            : differenceInDays + ' days ago';
  return res;
};