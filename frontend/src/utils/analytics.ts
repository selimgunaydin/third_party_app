export const formatDuration = (duration: number): string => {
  return `${Math.round(duration / 1000)} saniye`;
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('tr-TR');
}; 