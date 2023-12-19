import { useState } from "react";

const usePagination = <T>(data: T[], options: { pageSize: number }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(data.length / options.pageSize);

  const currentData = data.slice(
    currentPage * options.pageSize,
    (currentPage + 1) * options.pageSize
  );

  const previousPage = () => {
    if (currentPage !== 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== pageCount - 1) {
      setCurrentPage((p) => p + 1);
    }
  };

  const setPage = (page: number) => setCurrentPage(page);

  return {
    currentPage,
    pageCount,
    currentData,
    previousPage,
    nextPage,
    setPage,
  };
};

export default usePagination;
