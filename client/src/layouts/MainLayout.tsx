import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <main className="flex flex-col min-h-screen justify-between">
      <div>
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default MainLayout;
