export default function getPaginationObject(
  totalItems: number,
  currentPage: number
) {
  const totalPages = Math.ceil(totalItems / 10);
  return {
    totalItems: totalItems,
    totalPages: totalPages,
    currentPage: currentPage,
    pageSize: 10,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}
