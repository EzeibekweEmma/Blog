import { useLocation } from 'react-router-dom';
import Search from './Search';
import Cookies from 'js-cookie';
import { IOptionProps } from '../interface';
import { Link } from 'react-router-dom';
import { categories } from '../helper';
import { FiEdit } from 'react-icons/fi';
import { IoFilter } from 'react-icons/io5';

interface UserState {
  userDetails: string;
}

const MainCategories: React.FC<IOptionProps> = ({ setOptions, options }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlCategories = searchParams.get('categories') || 'General';

  const userState: UserState | null = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  return (
    <div className="relative hidden md:flex flex-col lg:flex-row bg-white rounded-3xl xl:rounded-full h-14 px-8 shadow-lg items-center justify-center lg:gap-8 mb-4 lg:mb-0">
      {userState && (
        <div className="absolute xl:text-lg font-medium w-full justify-between sm:px-5 items-center gap-2 -top-12 hidden md:flex">
          <Link to={`${location.pathname}/create`}>
            <FiEdit className="text-2xl h-9 w-9 p-2 text-[#2c586a] rounded-full stroke-2 hover:text-[#f3f8f6] hover:bg-[#2c586a] transition-all ease-in-out" />
          </Link>

          <div className="flex items-center">
            <span className="text-[#2c586a] mr-2 hidden sm:inline-flex">
              <IoFilter className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full stroke-2" />
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
      )}
      <div className="flex-1 flex items-center justify-between flex-wrap w-full mt-8 mb-2 lg:m-0">
        {['General', ...categories].map((categories, index) => (
          <button
            onClick={() => setOptions({ ...options, categories })}
            key={index}
            className={`xl:text-lg font-medium text-[#2c586a] hover:border-b-2 border-[#2c586a] transition-all ease-in-out ${
              urlCategories.toLowerCase() === categories.toLowerCase() &&
              'border-b-2'
            }`}
          >
            {categories}
          </button>
        ))}
      </div>
      <Search setOptions={setOptions} options={options} />
    </div>
  );
};

export default MainCategories;
