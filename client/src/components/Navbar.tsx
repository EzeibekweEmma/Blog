import Cookies from 'js-cookie'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '../main'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null

  const navList = [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'News', path: '/news' }
  ];

  const handleLogout = async () => {
    setIsOpen(false)
    const response = await axios.post(`${API_URL}/auth/logout`)

    if (response.status.toString().startsWith('2')) {
      toast.success(response.data.message)
      navigate('/')
    } else {
      toast.success('Logged out successfully')
      Cookies.remove('userDetails')
      Cookies.remove('token')
      navigate('/')
    }
  }

  return (
    <nav className='flex justify-center bg-[#2c586a] text-[#f3f8f6] z-50'>
      <div className='w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] 2xl:w-[1250px]'>
        <div className='w-full h-16 md:h-20 flex items-center justify-between'>
          {/* LOGO */}
          <Link to='/' className='flex items-center gap-1 text-2xl font-bold'>
            <img src='logo.png' alt='Logo' className='h-12 w-12' />
            <span>Empire Report</span>
          </Link>
          {/* MOBILE MENU */}
          <div className='md:hidden'>
            {/* MOBILE BUTTON */}
            <div
              className='cursor-pointer text-4xl'
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {/* Change Hamburger Icon */}
              {/* {isOpen ? "X" : "☰"} */}
              <div className='flex flex-col gap-[5.4px]'>
                <div
                  className={`h-[3px] rounded-md w-6 bg-[#f3f8f6] origin-left transition-all ease-in-out ${
                    isOpen && 'rotate-45'
                  }`}
                />
                <div
                  className={`h-[3px] rounded-md w-6 bg-[#f3f8f6] transition-all ease-in-out ${
                    isOpen && 'opacity-0'
                  }`}
                />
                <div
                  className={`h-[3px] rounded-md w-6 bg-[#f3f8f6] origin-left transition-all ease-in-out ${
                    isOpen && '-rotate-45'
                  }`}
                />
              </div>
            </div>
            {/* MOBILE LINK LIST */}
            <div
              className={`w-full h-screen bg-[#2c586a] flex flex-col items-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out pt-20 ${
                isOpen ? '-right-0' : '-right-[100%]'
              }`}
            >
              {navList.map((navItem, index) => (
                <Link
                  to={navItem.path}
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className={`border-[#f3f8f6] hover:border-b-2 transition-all ease-in-out ${
                    location.pathname === navItem.path && 'border-b-2'
                  }`}
                >
                  {navItem.name}
                </Link>
              ))}
              {userState && (
                <button
                  onClick={() => handleLogout()}
                  className='py-1 px-4 rounded-3xl hover:bg-[#f3f8f6] bg-[#2c586a] hover:text-[#2c586a] text-[#f3f8f6] border-[#f3f8f6] border-2'
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          {/* DESKTOP MENU */}
          <div className='hidden md:flex items-center gap-8 xl:gap-12 font-medium'>
            {navList.map((navItem, index) => (
              <Link
                to={navItem.path}
                key={index}
                className={`border-[#f3f8f6] hover:border-b-2 transition-all ease-in-out ${
                  location.pathname === navItem.path && 'border-b-2'
                }`}
              >
                {navItem.name}
              </Link>
            ))}
            {userState && (
              <button
                onClick={() => handleLogout()}
                className='py-1 px-4 rounded-3xl hover:bg-[#f3f8f6] bg-[#2c586a] hover:text-[#2c586a] text-[#f3f8f6] border-[#f3f8f6] border-2'
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar
