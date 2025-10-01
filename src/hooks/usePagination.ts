import { useState, useMemo } from "react";

export type UsePaginationProps = {
  totalCount: number; 
  pageSize?: number;  
  siblingCount?: number; 
  currentPage?: number; 
};

export function usePagination({
  totalCount,
  pageSize = 10,
  siblingCount = 1,
  currentPage: initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalCount / pageSize);

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      return [...Array(totalPages).keys()].map(n => n + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const range: (number | string)[] = [];

    if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= 3 + 2 * siblingCount; i++) {
        range.push(i);
      }
      range.push("...");
      range.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      range.push(1);
      range.push("...");
      for (let i = totalPages - (3 + 2 * siblingCount) + 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      range.push(1);
      range.push("...");
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i);
      }
      range.push("...");
      range.push(totalPages);
    }

    return range;
  }, [siblingCount, totalPages, currentPage]);

  const skip = (currentPage - 1) * pageSize;
  const take = pageSize;

  return {
    currentPage,
    totalPages,
    skip,
    take,
    setCurrentPage,
    paginationRange,
    pageSize,
  };
}
