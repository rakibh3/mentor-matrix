import { useMemo, useState } from 'react';

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  handlePageChange: (page: number) => void;
}

/**
 * Reusable pagination hook
 * @param data - Array of data to paginate
 * @param rowsPerPage - Number of items per page
 */
export const usePagination = <T>(data: T[], rowsPerPage: number): UsePaginationResult<T> => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentData,
    handlePageChange,
  };
};
