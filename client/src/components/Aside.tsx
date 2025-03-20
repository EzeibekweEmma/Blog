import React from 'react';
import { Link } from 'react-router-dom';
const Aside = () => {
  return (
    <aside className="flex-[0.35] md:block hidden">
      <div>
        <h2 className="text-xl font-medium border-b border-[#2c586a] text-[#2c586a] mt-5">
          Related Posts
        </h2>
        <ul className="mt-3">
          <li className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Link to="#" className="font-medium text-[#2c586a]">
                  Blog Title
                </Link>
                <p className="mt-1 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  consectetur adipiscing elit. Integer nec odio...{' '}
                  <Link to="#" className=" text-[#2c586a] text-sm">
                    Read more
                  </Link>
                </p>
              </div>
            ))}
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-medium border-b border-[#2c586a] text-[#2c586a] mt-5">
          Featured Posts
        </h2>
        <ul className="mt-3">
          <li className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Link to="#" className="font-medium text-[#2c586a]">
                  Lorem ipsum dolor sit amet
                </Link>
                <p className="mt-1 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  consectetur adipiscing elit. Integer nec odio...{' '}
                  <Link to="#" className=" text-[#2c586a] text-sm">
                    Read more
                  </Link>
                </p>
              </div>
            ))}
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-medium border-b border-[#2c586a] text-[#2c586a] mt-5">
          Recent Posts
        </h2>
        <ul className="mt-3">
          <li className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Link to="#" className="font-medium text-[#2c586a]">
                  Blog Title
                </Link>
                <p className="mt-1 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  consectetur adipiscing elit. Integer nec odio...{' '}
                  <Link to="#" className=" text-[#2c586a] text-sm">
                    Read more
                  </Link>
                </p>
              </div>
            ))}
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-medium border-b border-[#2c586a] text-[#2c586a] mt-5">
          Categories
        </h2>
        <ul className="mt-3">
          <li>
            <Link to="#" className="font-medium text-[#2c586a]">
              Category 1
            </Link>
          </li>
          <li>
            <Link to="#" className="font-medium text-[#2c586a]">
              Category 2
            </Link>
          </li>
          <li>
            <Link to="#" className="font-medium text-[#2c586a]">
              Category 3
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
