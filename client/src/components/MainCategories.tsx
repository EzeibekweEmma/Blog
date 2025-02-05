import { Link, useLocation } from 'react-router-dom';
import Search from './Search';

const MainCategories = () => {
  const location = useLocation();
  const urlCategory = location.search
    ? location.search.split('=')[1]?.replace(/%20/g, ' ')
    : 'All Posts';

  const categories = [
    'All Posts',
    'Web Design',
    'Development',
    'Databases',
    'SEO',
    'Marketing',
  ];
  return (
    <div className="hidden md:flex flex-col lg:flex-row bg-white rounded-3xl xl:rounded-full h-14 px-8 shadow-lg items-center justify-center lg:gap-8 mb-4 lg:mb-0">
      <div className="flex-1 flex items-center justify-between flex-wrap w-full mt-8 mb-2 lg:m-0">
        {categories.map((category, index) => (
          <Link
            to={`/blogs?category=${category}`}
            key={index}
            className={`xl:text-lg font-medium hover:text-[#2c586a] hover:border-b-2 border-[#2c586a] transition-all ease-in-out ${
              urlCategory === category && 'border-b-2'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
      <Search />
    </div>
  );
};

export default MainCategories;
