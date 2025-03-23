import PageWrapper from '../components/PageWrapper';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../main';
import { toast } from 'react-toastify';
import EmptyCard from '../components/EmptyCardState';
import RecentPosts from '../components/RecentPosts';
import HeroIcon from '../components/HeroIcon';
import WhatWeOffer from '../components/Offer';

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogResponse = await axios.get(`${API_URL}/blogs`);
        const newsResponse = await axios.get(`${API_URL}/news`);
        const blogs = blogResponse.data?.posts || [];
        const news = newsResponse.data?.posts || [];
        setBlogs(blogs);
        setNews(news);
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
      <div className="flex flex-col gap-4">
        {/* INTRODUCTION */}
        <div>
          <div className="flex items-center justify-between md:mb-5">
            <div>
              <h1
                className="text-[#2c586a] text-2xl md:text-5xl lg:text-6xl font-bold max-w-4xl"
                style={{ lineHeight: '1.3' }}
              >
                Welcome To Empire Report Where Adventure Meets Awareness.
              </h1>
              <p className="mt-5 sm:mt-10 text-sm sm:text-base md:text-xl max-w-4xl">
                At Empire Report, we bring you the best of both
                worlds—captivating travel experiences and the latest global
                news. Whether you're an avid traveler, a digital nomad, or
                simply curious about the world, we’ve got you covered.
              </p>
            </div>

            <HeroIcon />
          </div>
          <WhatWeOffer />
        </div>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <EmptyCard isFeatured key={i} />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <RecentPosts post={blogs} title="Blogs" />
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <h1 className="text-2xl text-gray-600">No blogs found</h1>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {[...Array(3)].map((_, i) => (
                <EmptyCard isFeatured key={i} />
              ))}
            </div>
          ) : news.length > 0 ? (
            <RecentPosts post={news} title="News" />
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <h1 className="text-2xl text-gray-600">No News found</h1>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Homepage;
