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
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = searchParams.get('category');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/blogs?limit=9&category=${category}limit=${limit}&page=${page}`,
          {
            withCredentials: true,
          }
        );
        if (response.status.toString().startsWith('2')) {
          setBlogs(response.data.posts);
          searchParams.set('limit', response.data.limit);
          searchParams.set('page', response.data.page);
          setSearchParams(searchParams);
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data
        ) {
          toast.error(error.response.data.error);
        }
        toast.error('Something went wrong!');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <PageWrapper>
      <div className="my-8">
        <MainCategories />
        <span className="md:hidden">
          <Search />
        </span>
        {/* Blog post lists */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <BlogCardEmpty isFeatured key={i} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          blogs.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 mt-8">
              {blogs.map((blog, index) => (
                <div key={index} className="">
                  <BlogCard isFeatured blog={blog} />
                </div>
              ))}
            </div>
          )
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
