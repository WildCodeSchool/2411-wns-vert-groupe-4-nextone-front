import { useMemo } from "react";

export type UsePaginationProps = {
  totalCount: number; 
  pageSize?: number;  
  siblingCount?: number; 
  currentPage: number; 
};

export function usePagination({
  totalCount,
  pageSize = 10,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps) {


  // Calculate total pages
   const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((totalCount || 0) / pageSize));
  }, [totalCount, pageSize]);

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
      const leftItemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItemCount; i++) {
        range.push(i);
      }
      range.push("...");
      range.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      range.push(1);
      range.push("...");
      const rightItemCount = 3 + 2 * siblingCount;
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
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
    } else {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    }

    return range;
  }, [siblingCount, totalPages, currentPage]);

  const skip = (currentPage - 1) * pageSize;
  const take = pageSize;

  return {
    totalPages,
    skip,
    take,
    paginationRange, 
    pageSize,
  };
}