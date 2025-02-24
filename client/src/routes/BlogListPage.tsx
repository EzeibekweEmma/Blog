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
import InfiniteScroll from 'react-infinite-scroll-component';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState(() => {
    return JSON.parse(localStorage.getItem('blogs') || '[]');
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Get query params
  const category = searchParams.get('category') || '';
  const limit = Number(searchParams.get('limit')) || 9;
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    fetchBlogs(page);
  }, []);

  const fetchBlogs = async (currentPage: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/blogs?limit=${limit}&category=${category}&page=${currentPage}`,
        { withCredentials: true }
      );

      if (response.status.toString().startsWith('2')) {
        const newBlogs = response.data.posts;

        setBlogs((prevBlogs) => {
          const updatedBlogs = [...prevBlogs, ...newBlogs];

          // Save updated blogs to localStorage
          localStorage.setItem('blogs', JSON.stringify(updatedBlogs));

          return updatedBlogs;
        });

        setHasMore(newBlogs.length >= limit);

        // Update URL params
        searchParams.set('limit', String(limit));
        searchParams.set('page', String(currentPage + 1));
        setSearchParams(searchParams);

        setPage(currentPage + 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong!');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
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
          <InfiniteScroll
            dataLength={blogs.length}
            next={() => fetchBlogs(page)}
            hasMore={hasMore}
            loader={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <BlogCardEmpty isFeatured key={i} />
                ))}
              </div>
            }
            endMessage={
              <p className="text-center mt-5 text-gray-600">
                No more blogs to show
              </p>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-8">
              {blogs.map((blog, index) => (
                <div key={index}>
                  <BlogCard isFeatured blog={blog} />
                </div>
              ))}
            </div>
          </InfiniteScroll>
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
