import { useLocation } from 'react-router-dom';
import Search from './Search';
import { IOptionProps } from '../interface';
import { categories } from '../helper';
import Filter from './Filter';

const MainCategories: React.FC<IOptionProps> = ({ setOptions, options }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlCategories = searchParams.get('categories') || 'General';

  return (
    <div className="relative hidden md:flex flex-col lg:flex-row bg-white rounded-3xl xl:rounded-full h-14 px-8 shadow-lg items-center justify-center lg:gap-8 mb-4 lg:mb-0">
      <Filter options={options} setOptions={setOptions} />
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
