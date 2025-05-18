export const calculatePaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = Boolean(totalPages - page);
  const hasNextPage = page !== 1;

  return {
    totalItems: count,
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
