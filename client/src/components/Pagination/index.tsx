import { NextButton, PreviousButton } from './Button';
import NumbersBtn from './NumbersBtn';

function Pagination({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}) {
  const currentPage = page;

  const paginateTo = (number: number) => {
    if (number === currentPage) return;
    setPage(number);
  };

  return (
    totalPages > 1 && (
      <div className="flex items-center text-brand-subtitle justify-between border-t-2 border-grey-300/50 pt-5">
        {/* Previous button */}
        <PreviousButton currentPage={currentPage} paginateTo={paginateTo} />
        {/* Number buttons */}
        <NumbersBtn
          currentPage={currentPage}
          totalPages={totalPages}
          paginateTo={paginateTo}
        />
        {/* Next button */}
        <NextButton
          currentPage={currentPage}
          totalPages={totalPages}
          paginateTo={paginateTo}
        />
      </div>
    )
  );
}

export default Pagination;
