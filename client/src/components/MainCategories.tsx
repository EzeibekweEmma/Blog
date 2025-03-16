import { useLocation } from 'react-router-dom';
import Search from './Search';
import Cookies from 'js-cookie';
import { IOptionProps } from '../interface';
import Filter from './Filter';

interface UserState {
  userDetails: string;
}

const MainCategories: React.FC<IOptionProps> = ({ setOptions, options }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlCategory = searchParams.get('category') || 'General';

  const categories: string[] = [
    'General',
    'Web Design',
    'Development',
    'Database',
    'SEO',
    'Marketing',
  ];

  const userState: UserState | null = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  return (
    <div className="relative hidden md:flex flex-col lg:flex-row bg-white rounded-3xl xl:rounded-full h-14 px-8 shadow-lg items-center justify-center lg:gap-8 mb-4 lg:mb-0">
      {userState && (
        <Filter
          setOptions={setOptions}
          options={options}
          style={'-top-12 hidden md:flex'}
        />
      )}
      <div className="flex-1 flex items-center justify-between flex-wrap w-full mt-8 mb-2 lg:m-0">
        {categories.map((category, index) => (
          <button
            onClick={() => setOptions({ ...options, category })}
            key={index}
            className={`xl:text-lg font-medium hover:text-[#2c586a] hover:border-b-2 border-[#2c586a] transition-all ease-in-out ${
              urlCategory === category && 'border-b-2'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <Search setOptions={setOptions} options={options} />
    </div>
  );
};

export default MainCategories;
