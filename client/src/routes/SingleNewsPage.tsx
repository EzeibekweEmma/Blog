import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import PageWrapper from '../components/PageWrapper';
import { API_URL } from '../main';
import { IPost } from '../interface';
import { formatDate } from '../utils';
import { HiHashtag } from 'react-icons/hi2';
import Cookies from 'js-cookie';
import { IoTrashBinOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { toast } from 'react-toastify';
import PostLoadingState from '../components/PostLoadingState';
import NotFoundPage from './NotFoundPage';

const SingleNewsPage = () => {
  const { slug } = useParams();
  const [news, setNews] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  useEffect(() => {
    if (!slug) navigate('/404');

    const fetchNews = async () => {
      try {
        const response = await axios.get(
          userState ? `${API_URL}/news/all/${slug}` : `${API_URL}/news/${slug}`
        );
        const news = response.data?.news || null;
        setNews(news);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return navigate('/404');
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  const handleChange = async (action: 'delete' | 'restore') => {
    try {
      const response =
        action === 'delete'
          ? await axios.delete(`${API_URL}/news/${action}/${slug}`)
          : await axios.patch(`${API_URL}/news/${action}/${slug}`);

      if (response.status.toString().startsWith('2')) {
        toast.success(response.data.message);
        setNews({
          ...news,
          isDeleted: action === 'delete' ? true : false,
        } as IPost);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <PostLoadingState />;
  if (!news) return <NotFoundPage baseLink="/news" />;

  // Sanitize content before rendering
  const sanitizedContent = DOMPurify.sanitize(news.content);

  return (
    <PageWrapper>
      <div className="md:-mt-10 relative">
        {userState && (
          <div className="absolute -top-5 right-5 gap-3 flex">
            <button
              onClick={() =>
                handleChange(news.isDeleted ? 'restore' : 'delete')
              }
              className="hover:border-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out border-2 flex gap-0.5 items-center"
            >
              {news.isDeleted ? (
                <>
                  <MdOutlineSettingsBackupRestore className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full" />
                  <span>Restore</span>
                </>
              ) : (
                <>
                  <IoTrashBinOutline className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full stroke-2" />
                  <span>Delete</span>
                </>
              )}
            </button>
            <Link
              to={`/news/edit/${news.slug}`}
              className="hover:border-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out border-2 flex gap-0.5 items-center"
            >
              <FiEdit className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full stroke-2" />
              <span>Edit</span>
            </Link>
          </div>
        )}

        <div className="flex font-medium text-[#2c586a] items-center text-sm gap-1.5">
          <span>{formatDate(news.createdAt)}</span>
          <span className="text-sm">•</span>
          <span>By {news.user.name}</span>
        </div>
        <h1 className="text-4xl font-bold text-[#2c586a] my-2">{news.title}</h1>
        <p className="mb-5">{news.description}</p>
        <img
          src={news.image}
          alt="News Cover"
          className="mb-6 md:mb-10 w-full max-h-[67vh] rounded-lg shadow-md object-cover object-center"
        />
        <div className="flex flex-col items-center gap-5">
          <div>
            <div
              className="prose prose-lg text-wrap prose-p:text-justify w-[90vw] md:max-w-[75vw] lg:max-w-[60vw]"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <div className="flex flex-wrap gap-2">
              {news.categories.length > 1 &&
                news.categories.map((category) => (
                  <Link
                    to={`/news?categories=${category}`}
                    key={category}
                    className="text-[#2c586a] text-sm font-medium hover:border-b-2 border-[#2c586a] transition-all ease-in-out flex gap-0.5 items-center"
                  >
                    <HiHashtag />
                    <span>{category}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SingleNewsPage;
