import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import MainCategories from '../components/MainCategories';
import BlogCard from '../components/BlogCard';
import BlogCardEmpty from '../components/BlogCardEmptyState';
import Search from '../components/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_URL } from '../main';
import { IBlogPost } from '../interface';
import FeaturedPosts from '../components/FeaturedPosts';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<IBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [options, setOptions] = useState<{
    categories: string;
    filterByDeleted: string | boolean;
    filterByPublished: string | boolean;
    searchQuery: string;
    sort: string;
  }>({
    categories: searchParams.get('categories') || 'General',
    filterByDeleted: searchParams.get('filterByDeleted') || 'both',
    filterByPublished: searchParams.get('filterByPublished') || 'both',
    searchQuery: searchParams.get('searchQuery') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const limit = Number(searchParams.get('limit')) || 18;
  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  const checkOptions =
    options.categories !== 'General' ||
    options.searchQuery !== '' ||
    options.filterByDeleted !== 'both' ||
    options.filterByPublished !== 'both' ||
    options.sort !== 'newest' ||
    page !== 1
      ? false
      : true;

  useEffect(() => {
    fetchBlogs(page);
  }, [page, JSON.stringify(options)]);

  const fetchBlogs = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        userState
          ? `${API_URL}/blogs/all?limit=${limit}&page=${currentPage}&categories=${options.categories}&filterByDeleted=${options.filterByDeleted}&filterByPublished=${options.filterByPublished}&searchQuery=${options.searchQuery}&sort=${options.sort}`
          : `${API_URL}/blogs?limit=${limit}&page=${currentPage}&categories=${options.categories}&searchQuery=${options.searchQuery}`
      );

      if (response.status.toString().startsWith('2')) {
        setBlogs(response.data.posts || []);
        setHasMore(response.data.hasMore);

        // Update search params
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(currentPage));
        newParams.set('limit', String(limit));
        newParams.set('searchQuery', options.searchQuery);
        newParams.set('categories', options.categories);
        newParams.set('filterByDeleted', String(options.filterByDeleted));
        newParams.set('filterByPublished', String(options.filterByPublished));
        newParams.set('sort', options.sort);

        setSearchParams(newParams);
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data.error
          : 'Something went wrong!'
      );
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnLoad = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const featuredBlog = blogs.filter((b) => b.isFeatured === true);

  return (
    <PageWrapper>
      <div>
        <MainCategories setOptions={setOptions} options={options} />
        <span className="md:hidden">
          <Search setOptions={setOptions} options={options} />
        </span>

        {isLoading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <BlogCardEmpty isFeatured key={i} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            {checkOptions && (
              <>
                <FeaturedPosts blog={featuredBlog} setBlogs={setBlogs} />
                <h1 className="mt-8 text-2xl text-gray-600">Recent Blogs</h1>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {blogs.map((blog) => (
                <BlogCard
                  isFeatured
                  blog={blog}
                  setBlogs={setBlogs}
                  key={blog.slug}
                />
              ))}
            </div>
            <div className="text-center mt-4">
              {hasMore ? (
                <button
                  onClick={handleOnLoad}
                  className="bg-[#2c586a] hover:bg-[#2c586a] text-white font-bold py-2 px-4 rounded-full"
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
