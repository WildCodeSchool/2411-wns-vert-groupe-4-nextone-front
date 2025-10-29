import { Button } from "./button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationControlsProps = {
  paginationRange: (number | string)[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  paginationRange,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4 gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>

      {Array.isArray(paginationRange) &&
         paginationRange.map((page, idx) => {

        if (page === "...") {
          return (
            <MoreHorizontal
              key={`dots-${idx}`}
              className="w-4 h-4 text-gray-400 mx-2"
            />
          );
        }

        return (
          <Button
            key={page}
            size="sm"
            className={`w-8 h-8 p-0 text-sm ${
              page === currentPage
                ? "bg-[#B5E303] text-black hover:bg-[#a5d102]" 
                : "bg-transparent text-gray-700 hover:bg-muted"
            }`}
  onClick={() => {
                if (typeof page === "number" && !isNaN(page)) {
                  onPageChange(page);
                }
              }}
>
  {page}
</Button>

        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
