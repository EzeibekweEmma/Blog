function numberLogic(totalPages: number, currentPage: number) {
  const paginationNumbers: (string | number)[] = [];

  // Logic for displaying pagination numbers
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) {
      paginationNumbers.push(i);
    }
  } else {
    paginationNumbers.push(1);
    if (currentPage <= 2 || currentPage >= totalPages - 1) {
      paginationNumbers.push(2, 3, '...', totalPages - 2, totalPages - 1, totalPages);
    } else if (currentPage === 3) {
      paginationNumbers.push(2, 3, 4, 5, '...', totalPages);
    } else if (currentPage === totalPages - 2) {
      paginationNumbers.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      paginationNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return paginationNumbers;
}

export default numberLogic;
