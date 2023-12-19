"use client";

import usePagination from "@/hooks/usePagination";
import Button from "@/components/Button";

interface Props<T> {
  data: T[];
  pageSize?: number;
  children: (data: T[]) => React.ReactNode;
}

const Pagination = <T,>({ data, pageSize = 10, children }: Props<T>) => {
  const {
    currentPage,
    currentData,
    pageCount,
    previousPage,
    nextPage,
    setPage,
  } = usePagination<T>(data, {
    pageSize,
  });

  return (
    <>
      {children(currentData)}

      {pageCount !== 1 ? (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              onClick={previousPage}
              disabled={currentPage === 0}
              className="bg-white !w-12"
            >
              {"<"}
            </Button>
            {Array(pageCount)
              .fill(null)
              .map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setPage(index)}
                  className={[
                    "!w-12",
                    currentPage === index ? "bg-green" : "bg-white",
                  ].join(" ")}
                >
                  {index + 1}
                </Button>
              ))}
            <Button
              onClick={nextPage}
              disabled={currentPage === pageCount - 1}
              className="bg-white !w-12"
            >
              {">"}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Pagination;
