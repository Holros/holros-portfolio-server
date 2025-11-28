export default function getPaginationObject(
  totalItems: number,
  currentPage: number,
  pageSize: number
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    totalItems: totalItems,
    totalPages: totalPages,
    currentPage: currentPage,
    pageSize: pageSize,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}
