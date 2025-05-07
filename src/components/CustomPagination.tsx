import { useEffect } from "react";
import { Pagination } from "react-bootstrap";

interface CustomPaginationProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  alwaysShown?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  alwaysShown = true
}) => {

  const pagesCount = Math.ceil(itemsCount / itemsPerPage);
  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 1;
  const isCurrentPageLast = currentPage === pagesCount;

  const changePage = (num: number) => {
    if (currentPage === num) {
        return;
    }
    setCurrentPage(num);
};

  const onPageNumberClick = (pageNumber: number) => {
    changePage(pageNumber);
  };

  const onPreviousPageClick = () => {
    if (currentPage <= 1) {
      return changePage(1);
    } else {
      changePage(currentPage - 1);
    }
  };

  const onNextPageClick = () => {
    changePage(currentPage + 1);
  };

  const setLastPageAsCurrent = () => {
    if (currentPage > pagesCount) {
      pagesCount && setCurrentPage(pagesCount);
    }
  };

  let isPageNumberOutOfRange = false;

  const pageNumbers = [...new Array(pagesCount)].map((_, index) => {
    const pageNumber = index+1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pagesCount;
    const isCurrentPageWithinTwoPageNumbers = Math.abs(pageNumber - currentPage) <= 2;

    if (isPageNumberFirst || isPageNumberLast || isCurrentPageWithinTwoPageNumbers) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          activeLabel=""
          key={pageNumber}
          onClick={() => onPageNumberClick(pageNumber)}
          active={pageNumber === currentPage}
        >
          {pageNumber}
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return <Pagination.Ellipsis key={`ellipsis-${pageNumber}`} disabled={true} className="muted" />;
    }

    return null;
  });

  useEffect(setLastPageAsCurrent, [pagesCount]);

  return (
    <>
        <div>
            {isPaginationShown && (
            <Pagination size="sm">
              <Pagination.Prev
                  className={isCurrentPageFirst ? "disable" : ""}
                  onClick={onPreviousPageClick}
                  disabled={isCurrentPageFirst}
              />
              {pageNumbers}
              <Pagination.Next
                  onClick={onNextPageClick}
                  disabled={isCurrentPageLast}
                  className={isCurrentPageLast ? "disable" : ""}
              />
            </Pagination>
            )}
        </div>
    </>
  );
};

export default CustomPagination;
