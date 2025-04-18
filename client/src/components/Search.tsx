import { IOptionProps } from '../interface';
import { useEffect, useState } from 'react';
import Filter from './Filter';

const Search: React.FC<IOptionProps> = ({ setOptions, options }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setOptions({ ...options, searchQuery });
      }
    }, 700);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full lg:w-fit relative">
      <Filter
        options={options}
        setOptions={setOptions}
        style="-top-10 md:hidden"
      />
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
          className="bg-transparent outline-none inset-2 w-full placeholder:text-[#2c586a] pr-9 md:pr-2"
          onChange={handleChange}
          value={searchQuery}
        />
      </div>
    </div>
  );
};

export default Search;
