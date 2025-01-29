import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [open, isOpen] = useState(false);

  return (
    <nav className="flex justify-center bg-[#2c586a] text-[#f3f8f6] z-50">
      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] 2xl:w-[1250px]">
        <div className="w-full h-16 md:h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-1 text-2xl font-bold">
            <img src="logo.png" alt="Logo" className="h-12 w-12" />
            <span>BlogApp</span>
          </Link>
          {/* MOBILE MENU */}
          <div className="md:hidden">
            {/* MOBILE BUTTON */}
            <div
              className="cursor-pointer text-4xl"
              onClick={() => isOpen((prev) => !prev)}
            >
              {/* Change Hamburger Icon */}
              {/* {open ? "X" : "☰"} */}
              <div className="flex flex-col gap-[5.4px]">
                <div
                  className={`h-[3px] rounded-md w-6 bg-[#f3f8f6] origin-left transition-all ease-in-out ${
                    open && 'rotate-45'
                  }`}
                />
                <div
                  className={`h-[3px] rounded-md w-6 bg-[#f3f8f6] transition-all ease-in-out ${
                    open && 'opacity-0'
                  }`}
                />
                <div
                  className={`h-[3px] rounded-md w-6 bg-[#f3f8f6] origin-left transition-all ease-in-out ${
                    open && '-rotate-45'
                  }`}
                />
              </div>
            </div>
            {/* MOBILE LINK LIST */}
            <div
              className={`w-full h-screen bg-[#2c586a] flex flex-col items-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out pt-20 ${
                open ? '-right-0' : '-right-[100%]'
              }`}
            >
              <Link to="/" onClick={() => isOpen(false)}>
                Home
              </Link>
              <Link to="/blogs?sort=trending" onClick={() => isOpen(false)}>
                Trending
              </Link>
              <Link to="/blogs?sort=popular" onClick={() => isOpen(false)}>
                Most Popular
              </Link>
              <Link to="/" onClick={() => isOpen(false)}>
                About
              </Link>
              <Link to="/login" onClick={() => isOpen(false)}>
                <button className="py-2 px-4 rounded-3xl hover:bg-[#2c586a] bg-[#f3f8f6] hover:text-[#f3f8f6] text-[#2c586a] border-[#f3f8f6] border-2">
                  Login 👋
                </button>
              </Link>
            </div>
          </div>
          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
            <Link to="/">Home</Link>
            <Link to="/blogs?sort=trending">Trending</Link>
            <Link to="/blogs?sort=popular">Most Popular</Link>
            <Link to="/">About</Link>
            <SignedOut>
              <Link to="/login">
                <button className="py-2 px-4 rounded-3xl hover:bg-[#2c586a] bg-[#f3f8f6] hover:text-[#f3f8f6] text-[#2c586a] border-[#f3f8f6] border-2">
                  Login 👋
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
