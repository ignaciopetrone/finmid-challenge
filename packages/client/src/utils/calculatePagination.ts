const calculatePagination = (limit: number, offset: number, total: number) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const nextOffset = currentPage < totalPages ? offset + limit : offset;
  const prevOffset = currentPage > 1 ? offset - limit : offset;

  return {
    currentPage,
    totalPages,
    nextOffset,
    prevOffset,
  };
};

export default calculatePagination;
