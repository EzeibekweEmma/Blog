import React from 'react';
import { IOptionProps } from '../interface';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FiEdit } from 'react-icons/fi';
import { IoFilter } from 'react-icons/io5';
import { boolean } from 'zod';

const Filter: React.FC<IOptionProps & { style?: string }> = ({
  setOptions,
  options,
  style = '-top-12',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

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

        <div className="flex relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`text-2xl h-9 w-9 p-2 flex justify-center items-center rounded-full stroke-2 hover:text-[#f3f8f6] hover:bg-[#2c586a] transition-all ease-in-out z-20 ${
              isOpen ? 'text-[#f3f8f6] bg-[#2c586a]' : 'text-[#2c586a]'
            }`}
          >
            <IoFilter />
          </button>
          {isOpen && (
            <div className="absolute right-4 top-4 bg-white border-[#2c586a] border-2 rounded-lg p-4 flex flex-col justify-center items-center gap-3 z-10 text-[#2c586a]">
              {/* Deleted */}
              <>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="deleted"
                    value="false"
                    className="hidden"
                    onChange={() =>
                      setOptions({ ...options, filterByDeleted: false })
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      options.filterByDeleted === false &&
                      'text-[#f3f8f6] bg-[#2c586a]'
                    }`}
                  >
                    Not&nbsp;Deleted
                  </span>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="deleted"
                    value="true"
                    className="hidden"
                    onChange={() =>
                      setOptions({ ...options, filterByDeleted: true })
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      options.filterByDeleted === true &&
                      'text-[#f3f8f6] bg-[#2c586a]'
                    }`}
                  >
                    Only&nbsp;Deleted
                  </span>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="deleted"
                    value="all"
                    className="hidden"
                    onChange={() =>
                      setOptions({ ...options, filterByDeleted: 'both' })
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      typeof options.filterByDeleted !== 'boolean' &&
                      'text-[#f3f8f6] bg-[#2c586a]'
                    }`}
                  >
                    Both
                  </span>
                </label>
              </>

              {/* Published */}
              <>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="published"
                    value="false"
                    className="hidden"
                    onChange={() =>
                      setOptions({ ...options, filterByPublished: false })
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      options.filterByPublished === false &&
                      'text-[#f3f8f6] bg-[#2c586a]'
                    }`}
                  >
                    Not&nbsp;Published
                  </span>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="published"
                    value="true"
                    className="hidden"
                    onChange={() =>
                      setOptions({ ...options, filterByPublished: true })
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      options.filterByPublished === true &&
                      'text-[#f3f8f6] bg-[#2c586a]'
                    }`}
                  >
                    Only&nbsp;Published
                  </span>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="published"
                    value="all"
                    className="hidden"
                    onChange={() =>
                      setOptions({ ...options, filterByPublished: 'both' })
                    }
                  />
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      typeof options.filterByPublished !== 'boolean' &&
                      'text-[#f3f8f6] bg-[#2c586a]'
                    }`}
                  >
                    Both
                  </span>
                </label>
              </>

              {/* Sort */}
              <button
                onClick={() =>
                  setOptions({
                    ...options,
                    sort:
                      options.sort.toLowerCase().trim() === 'newest'
                        ? 'oldest'
                        : 'newest',
                  })
                }
                className={`hover:text-[#f3f8f6] hover:bg-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out
                  ${
                    options.sort.toLowerCase().trim() === 'newest' &&
                    'text-[#f3f8f6] bg-[#2c586a]'
                  }`}
              >
                Newest
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Filter;
