import PageWrapper from '../components/PageWrapper';
import MainCategories from '../components/MainCategories';
import FeaturedPosts from '../components/FeaturedPosts';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../main';
import { toast } from 'react-toastify';
import BlogCardEmpty from '../components/BlogCardEmptyState';

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs`, {
          withCredentials: true,
        });
        if (response.status.toString().startsWith('2')) {
          setBlogs(response.data.posts);
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

  console.log(blogs);

  return (
    <PageWrapper>
      <div className="mt-4 mb-20 flex flex-col gap-4">
        {/* INTRODUCTION */}
        <div className="flex items-center justify-between my-5">
          <div>
            <h1 className="text-[#2c586a] text-2xl md:text-5xl lg:text-6xl font-bold max-w-3xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </h1>
            <p className="mt-8 text-md md:text-xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
              rerum accusantium.
            </p>
          </div>
          {/* animated button */}
          <div className="hidden md:block relative">
            <svg
              viewBox="0 0 200 200"
              width="200"
              height="200"
              className="text-lg tracking-widest"
            >
              <path
                id="circlePath"
                fill="none"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
              <text>
                <textPath href="#circlePath" startOffset="0%">
                  Write your story •
                </textPath>
                <textPath href="#circlePath" startOffset="50%">
                  Share your idea •
                </textPath>
              </text>
            </svg>
            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-[#2c586a] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <line x1="6" y1="18" x2="18" y2="6" />
                <polyline points="9 6 18 6 18 15" />
              </svg>
            </div>
          </div>
        </div>
        <MainCategories />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <BlogCardEmpty isFeatured key={i} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <FeaturedPosts blog={blogs} />
            <div>
              <h1 className="mt-8 mb-4 text-2xl text-gray-600">Recent Blogs</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog, index) => (
                  <div key={index}>
                    <BlogCard isFeatured blog={blog} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  to="/blogs"
                  className="bg-[#2c586a] text-[#f3f8f6] font-semibold py-3 px-4 rounded-3xl border-[#2c586a] border hover:bg-white hover:text-[#2c586a]"
                >
                  See More Blog
                </Link>
              </div>
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

export default Homepage;
