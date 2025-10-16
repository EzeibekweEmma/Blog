import { useLocation } from 'react-router-dom';
import Search from './Search';
import { IOptionProps } from '../interface';
import { newsCategories, blogCategories } from '../helper';
import { CiMenuKebab } from 'react-icons/ci';
import Filter from './Filter';
import { useState } from 'react';

const MainCategories: React.FC<IOptionProps> = ({ setOptions, options }) => {
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const urlCategories = searchParams.get('categories') || 'General';
  const categories = location.pathname.includes('/blog')
    ? blogCategories
    : newsCategories;

  const displayCategories = () => {
    return ['General', ...categories].map((categories, index) => (
      <button
        onClick={() => (
          setOptions({ ...options, categories }), setMobileMenu(false)
        )}
        key={index}
        className={`xl:text-lg font-medium text-[#2c586a] hover:border-b-2 border-[#2c586a] transition-all ease-in-out ${
          urlCategories.toLowerCase() === categories.toLowerCase() &&
          'border-b-2'
        }`}
      >
        {categories}
      </button>
    ));
  };

  return (
    <>
      <div className="relative hidden md:flex flex-col lg:flex-row bg-white rounded-3xl xl:rounded-full h-14 px-8 shadow-lg items-center justify-center lg:gap-8 mb-4 lg:mb-0">
        <Filter options={options} setOptions={setOptions} />
        <div className="flex-1 flex items-center justify-between flex-wrap w-full mt-8 mb-2 lg:m-0">
          {displayCategories()}
        </div>
        <Search setOptions={setOptions} options={options} />
      </div>
      <div className="md:hidden relative">
        <Search setOptions={setOptions} options={options} />

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="absolute top-2 right-2 group bg-[#f3f8f6] h-7 w-7 rounded-full flex items-center justify-center"
        >
          <CiMenuKebab className="text-[#2c586a] stroke-1 group-hover:rotate-180 duration-700" />
        </button>

        <div
          className={`${
            mobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } flex flex-col items-center p-5 border-2 absolute top-10 right-0 bg-[#f3f8f6] rounded-lg shadow-lg gap-2 z-10 duration-1000`}
        >
          {displayCategories()}
        </div>
      </div>
    </>
  );
};

export default MainCategories;
