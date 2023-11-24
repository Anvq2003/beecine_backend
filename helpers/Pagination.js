const paginationHelper = ({ page, limit, data }) => {
  const totalResults = data.length;
  const totalPages = Math.ceil(totalResults / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;
  const skip = (page - 1) * limit;
  data = data.slice(skip, skip + limit);

  return {
    data,
    info: {
      totalResults,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    },
  };
};

module.exports = paginationHelper;
