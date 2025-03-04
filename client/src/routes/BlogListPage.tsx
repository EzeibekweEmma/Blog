import PageWrapper from '../components/PageWrapper';
import MainCategories from '../components/MainCategories';
import BlogCard from '../components/BlogCard';
import Search from '../components/Search';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BlogCardEmpty from '../components/BlogCardEmptyState';
import { API_URL } from '../main';
import { useSearchParams } from 'react-router-dom';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const category = searchParams.get('category') || '';
  const limit = Number(searchParams.get('limit')) || 15;

  useEffect(() => {
    fetchBlogs(page);
  }, [page, category]);

  const fetchBlogs = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/blogs?limit=${limit}&page=${currentPage}&category=${category}`,
        { withCredentials: true }
      );

      if (response.status.toString().startsWith('2')) {
        const newBlogs = response.data.posts || [];
        setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
        setHasMore(response.data.hasMore);

        // Update URL params only if changed
        if (Number(searchParams.get('page')) !== currentPage) {
          searchParams.set('page', String(currentPage));
          searchParams.set('limit', String(limit));
          setSearchParams(searchParams);
        }
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data.error
          : 'Something went wrong!'
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnLoad = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <PageWrapper>
      <div>
        <MainCategories />
        <span className="md:hidden">
          <Search />
        </span>

        {isLoading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <BlogCardEmpty isFeatured key={i} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-8">
              {blogs.map((blog, index) => (
                <div key={index}>
                  <BlogCard isFeatured blog={blog} />
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              {hasMore ? (
                <button
                  onClick={handleOnLoad}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load more'}
                </button>
              ) : (
                <p className="text-gray-500">No more blogs available.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <h1 className="text-2xl text-gray-600">No blogs found</h1>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BlogListPage;
