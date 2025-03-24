import numberLogic from './NumberLogic';

function NumbersBtn({
  totalPages,
  currentPage,
  paginateTo,
}: {
  totalPages: number;
  currentPage: number;
  paginateTo: (page: number) => void;
}) {
  const paginationNumbers: (string | number)[] = numberLogic(
    totalPages,
    currentPage
  );

  return (
    <div className="flex font-medium gap-2">
      {paginationNumbers.map((pageNumber) => {
        const isNumber = typeof pageNumber === 'number';

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => paginateTo(isNumber ? pageNumber : currentPage)}
            className={`px-3 py-1.5 text-sm md:px-5 md:py-2.5 rounded-lg cursor-default ${
              isNumber && pageNumber === currentPage
                ? 'border-[#2c586a]/70 bg-[#2c586a]/40 text-[#2c586a]'
                : isNumber &&
                  'hover:cursor-pointer hover:border-[#2c586a]/70 hover:bg-[#2c586a]/40'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
}

export default NumbersBtn;
