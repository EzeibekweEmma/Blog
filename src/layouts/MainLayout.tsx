import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex justify-around">
      <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] 2xl:w-[1250px]">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
