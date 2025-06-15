
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({ page, total, pageSize, onPageChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages < 2) return null;

  return (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationPrevious
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className={page === 1 ? "pointer-events-none opacity-50" : ""}
        >
          Zurück
        </PaginationPrevious>
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={e => {
                  e.preventDefault();
                  onPageChange(i + 1);
                }}
                href="#"
              >
                {i + 1}
              </PaginationLink>
            </li>
          ))}
        </PaginationContent>
        <PaginationNext
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className={page === totalPages ? "pointer-events-none opacity-50" : ""}
        >
          Weiter
        </PaginationNext>
      </Pagination>
    </div>
  );
}
