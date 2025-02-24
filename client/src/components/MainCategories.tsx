import { Link, useLocation } from 'react-router-dom';
import Search from './Search';
import Cookies from 'js-cookie';

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

  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  return (
    <div className="relative hidden md:flex flex-col lg:flex-row bg-white rounded-3xl xl:rounded-full h-14 px-8 shadow-lg items-center justify-center lg:gap-8 mb-4 lg:mb-0">
      {userState && (
        <div className="absolute -top-12 right-2 xl:text-lg font-medium flex items-center gap-2">
          <span className="text-[#2c586a] mr-2">Filter by:</span>
          <Link
            to="/blogs?filterByDelete=true"
            className="hover:text-[#f3f8f6] hover:bg-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out"
          >
            Deleted
          </Link>
          <Link
            to="/blogs?filterByPublish=true"
            className="hover:text-[#f3f8f6] hover:bg-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out"
          >
            Published
          </Link>
        </div>
      )}
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
