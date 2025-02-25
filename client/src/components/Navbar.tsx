import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '../main'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RiWalkLine } from 'react-icons/ri'
import { FaBloggerB, FaHome, FaNewspaper } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const authRoutes = ['/blogs/create', '/news/create', '/blogs/:slug/edit']
  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null

  useEffect(() => {
    if (location.pathname === '/wisdom/2025/login' && userState) {
      navigate('/')
    } else if (
      !userState &&
      authRoutes.includes(location.pathname.toLowerCase())
    ) {
      navigate('/')
    }
  }, [userState, location.pathname, navigate])

  const navList = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Blogs', path: '/blogs', icon: <FaBloggerB /> },
    { name: 'News', path: '/news', icon: <FaNewspaper /> }
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
    <nav className='flex justify-center bg-[#2c586a] text-[#f3f8f6]'>
      <div className='w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] 2xl:w-[1250px]'>
        <div className='w-full h-16 md:h-20 flex items-center justify-between'>
          {/* LOGO */}
          <Link
            to='/'
            className='flex items-center gap-1 sm:text-2xl font-bold'
          >
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
              className={`w-full h-screen bg-[#2c586a] flex flex-col items-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out pt-20 z-50 ${
                isOpen ? '-right-0' : '-right-[100%]'
              }`}
            >
              {navList.map((navItem, index) => (
                <Link
                  to={navItem.path}
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className={`border-[#f3f8f6] hover:border-b-2 transition-all ease-in-out flex gap-1 items-center ${
                    location.pathname === navItem.path && 'border-b-2'
                  }`}
                >
                  {navItem.icon}
                  <span>{navItem.name}</span>
                </Link>
              ))}
              {userState && (
                <button
                  onClick={() => handleLogout()}
                  className='py-1 px-4 rounded-3xl hover:bg-[#f3f8f6] bg-[#2c586a] hover:text-[#2c586a] text-[#f3f8f6] border-[#f3f8f6] border-2 items-center flex gap-1'
                >
                  <span>Logout</span>
                  <RiWalkLine />
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
                className={`border-[#f3f8f6] hover:border-b-2 transition-all ease-in-out flex gap-1 items-center ${
                  location.pathname === navItem.path && 'border-b-2'
                }`}
              >
                {navItem.icon}
                <span>{navItem.name}</span>
              </Link>
            ))}
            {userState && (
              <button
                onClick={() => handleLogout()}
                className='py-1 px-4 rounded-3xl hover:bg-[#f3f8f6] bg-[#2c586a] hover:text-[#2c586a] text-[#f3f8f6] border-[#f3f8f6] border-2 flex gap-1 items-center'
              >
                <span>Logout</span>
                <RiWalkLine />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar
