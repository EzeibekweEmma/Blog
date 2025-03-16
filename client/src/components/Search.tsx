import Cookies from 'js-cookie';
import { IOptionProps } from '../interface';
import Filter from './Filter';
import { useEffect, useState } from 'react';

interface UserState {
  userDetails: string;
}
interface HandleKeyPressEvent extends React.KeyboardEvent<HTMLInputElement> {
  target: HTMLInputElement;
}
const Search: React.FC<IOptionProps> = ({ setOptions, options }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setOptions({ ...options, searchQuery });
      }
    }, 1000);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const userState: UserState | null = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  return (
    <div className="w-full lg:w-fit relative">
      {userState && (
        <Filter
          setOptions={setOptions}
          options={options}
          style={'-top-9 md:hidden flex'}
        />
      )}
      <div className="bg-[#e6edf0] p-1.5 rounded-full flex items-center gap-2 w-full lg:w-fit">
        <div className="p-1.5 rounded-full bg-[#f3f8f6]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="#2c586a"
          >
            <circle cx="10.5" cy="10.5" r="7.5" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="search for a blog..."
          className="bg-transparent outline-none inset-2 w-full placeholder:text-[#2c586a]"
          onChange={handleChange}
          value={searchQuery}
        />
      </div>
    </div>
  );
};

export default Search;
