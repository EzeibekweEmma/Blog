import React from 'react';
// import Image from './Image';
import { Link } from 'react-router-dom';
// import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  // const [open, isOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <h1>hello</h1>
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        {/* <Image src="logo.png" alt="Lama Logo" w={32} h={32} /> */}
        <span>BlogApp</span>
      </Link>
    </div>
  );
};

export default Navbar;
