import React from 'react';
import { IOptionProps } from '../interface';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FiEdit } from 'react-icons/fi';
import { IoFilter } from 'react-icons/io5';

const Filter: React.FC<IOptionProps & { style?: string }> = ({
  setOptions,
  options,
  style = '-top-12',
}) => {
  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  return (
    userState && (
      <div
        className={`absolute right-0 xl:text-lg font-medium w-full flex justify-between px-2 sm:px-5 items-center gap-2  ${style}`}
      >
        <Link to={`${location.pathname}/create`}>
          <FiEdit className="text-2xl h-9 w-9 p-2 text-[#2c586a] rounded-full stroke-2 hover:text-[#f3f8f6] hover:bg-[#2c586a] transition-all ease-in-out" />
        </Link>

        <div className="flex items-center">
          <IoFilter className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full stroke-2" />
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
                  ${
                    options.filterByPublished && 'text-[#f3f8f6] bg-[#2c586a]'
                  }`}
          >
            Published
          </button>
        </div>
      </div>
    )
  );
};

export default Filter;
