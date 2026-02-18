export const getPageRange = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  range.push(1);

  if (totalPages <= 1) return range;

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i < totalPages && i > 1) {
      range.push(i);
    }
  }

  range.push(totalPages);

  for (const i of range) {
    if (l !== undefined) {
      if (i as number - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i as number - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i as number;
  }

  return rangeWithDots;
};
