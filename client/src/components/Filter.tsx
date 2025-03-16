import React from 'react';
import { IOptionProps } from '../interface';
import { Link } from 'react-router-dom';

const Filter: React.FC<IOptionProps & { style?: string }> = ({
  setOptions,
  options,
  style = '-top-12 right-2',
}) => {
  return (
    <div
      className={`absolute xl:text-lg font-medium flex w-full justify-between sm:px-5 items-center gap-2  ${style}`}
    >
      <Link
        to={'#'}
        className="xl:text-lg font-medium flex items-center gap-2 hover:border-b-2 border-[#2c586a] transition-all ease-in-out"
      >
        Create
      </Link>

      <div>
        <span className="text-[#2c586a] mr-2 hidden sm:inline-flex">
          Filter by:
        </span>
        <button
          onClick={() =>
            setOptions({
              ...options,
              filterByDeleted: !options.filterByDeleted,
            })
          }
          className={`hover:text-[#f3f8f6] hover:bg-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out
              ${options.filterByDeleted && 'text-[#f3f8f6] bg-[#2c586a]'}`}
        >
          Deleted
        </button>
        <button
          onClick={() =>
            setOptions({
              ...options,
              filterByPublished: !options.filterByPublished,
            })
          }
          className={`hover:text-[#f3f8f6] hover:bg-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out
              ${options.filterByPublished && 'text-[#f3f8f6] bg-[#2c586a]'}`}
        >
          Published
        </button>
      </div>
    </div>
  );
};

export default Filter;
