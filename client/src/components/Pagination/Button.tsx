import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';

export function NextButton({
  currentPage,
  totalPages,
  paginateTo,
}: {
  currentPage: number;
  totalPages: number;
  paginateTo: (page: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => paginateTo(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`${
        currentPage === totalPages ? 'text-gray-600/50' : 'hover:text-[#2c586a]'
      } flex items-center font-medium md:space-x-2`}
    >
      <span className="hidden md:block">Next</span>
      <LuArrowRight className="text-base md:text-xl" />
    </button>
  );
}

export function PreviousButton({
  currentPage,
  paginateTo,
}: {
  currentPage: number;
  paginateTo: (page: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => paginateTo(currentPage - 1)}
      disabled={currentPage === 1}
      className={`${
        currentPage === 1 ? 'text-gray-600/50' : 'hover:text-[#2c586a]'
      } flex items-center font-medium md:space-x-2`}
    >
      <LuArrowLeft className="text-base md:text-xl" />
      <span className="hidden md:block">Previous</span>
    </button>
  );
}
