import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationControlProps {
  count: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function PaginationControl({ count, pageSize, page, onPageChange }: PaginationControlProps) {
  if (count <= pageSize) return null;

  return (
    <Pagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={(e) => onPageChange(e.page)}
    >
      <ButtonGroup variant="ghost" size="sm" mt={8} justifyContent="center" display="flex">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>
        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: "ghost", _selected: "outline" }}>{page.value}</IconButton>
          )}
        />
        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
}
