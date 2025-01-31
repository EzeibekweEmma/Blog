import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment);
  pathSegments.unshift('Home');

  return (
    <div className="flex gap-2 text-[#2c586a] text-sm">
      {/* Dynamic Breadcrumb Links */}
      {pathSegments.map((segment, index) => {
        // Build the full path up to this segment
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={index}>
            <Link
              to={path.toLowerCase() === '/home' ? '/' : path}
              className={`${
                index + 1 === pathSegments.length && 'font-semibold'
              } capitalize hover:font-semibold`}
            >
              {decodeURIComponent(segment.replace(/-/g, ' '))}
            </Link>
            {index < pathSegments.length - 1 && (
              <span className="font-bold">•</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
