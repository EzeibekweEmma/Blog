import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import MainCategories from '../components/MainCategories';
import Card from '../components/Card';
import EmptyCard from '../components/EmptyCardState';
// import Search from '../components/Search';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_URL } from '../main';
import { IPost } from '../interface';
// import FeaturedPosts from '../components/FeaturedPosts';
import Pagination from '../components/Pagination';
import { SEO } from '../components/SEO';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
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
        setTotalPage(response.data.totalPage);

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

  // Generate dynamic SEO based on filters
  const generateSEOContent = () => {
    let title = 'Travel Blogs & Stories';
    let description =
      'Discover amazing travel blogs and stories from around the world. Read about adventures, travel tips, and cultural experiences.';

    if (options.searchQuery) {
      title = `Search Results for "${options.searchQuery}"`;
      description = `Find travel blogs and stories related to "${options.searchQuery}". Explore our collection of travel content.`;
    } else if (options.categories && options.categories !== 'General') {
      title = `${options.categories} Travel Blogs`;
      description = `Explore travel blogs about ${options.categories}. Discover destinations, tips, and stories from this amazing region.`;
    }

    if (page > 1) {
      title += ` - Page ${page}`;
    }

    return { title, description };
  };

  const seoContent = generateSEOContent();

  return (
    <>
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        url={`https://empire-reports.com/blogs${
          searchParams.toString() ? '?' + searchParams.toString() : ''
        }`}
        type="website"
      />
      <PageWrapper>
        <div>
          <MainCategories setOptions={setOptions} options={options} />

          {isLoading && blogs.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[...Array(6)].map((_, i) => (
                <EmptyCard isFeatured key={i} />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <>
              {checkOptions && (
                <>
                  <h1 className="mt-8 text-2xl text-gray-600">Recent Blogs</h1>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {blogs.map((blog) => (
                  <Card
                    isFeatured
                    post={blog}
                    setPost={setBlogs}
                    key={blog.slug}
                  />
                ))}
              </div>
              <div className="text-center mt-4">
                <Pagination
                  totalPages={totalPage}
                  page={page}
                  setPage={setPage}
                />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <h1 className="text-2xl text-gray-600">No blogs found</h1>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
};

export default BlogListPage;
