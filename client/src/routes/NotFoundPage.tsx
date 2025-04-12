import { TbError404 } from 'react-icons/tb';
import { MdSearchOff } from 'react-icons/md';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ baseLink = '/' }: { baseLink?: string }) => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center h-[50vh] mx-5">
        <div className="relative">
          <MdSearchOff className="h-40 w-40 text-[#2c586a]" />
          <TbError404 className="text-3xl text-[#2c586a] absolute top-12 left-12" />
        </div>
        <p className="text-lg font-medium text-[#2c586a] mt-5 text-center">
          The page you are looking for does not exist.
        </p>
        <Link
          to={baseLink}
          className="mt-5 bg-[#2c586a] text-[#f3f8f6] font-semibold py-3 px-4 rounded-3xl border-[#2c586a] border hover:bg-white hover:text-[#2c586a]"
        >
          Go back to {baseLink !== '/' ? baseLink.replace(/^\//, '') : 'home'}{' '}
          page
        </Link>
      </div>
    </PageWrapper>
  );
};

export default NotFoundPage;
