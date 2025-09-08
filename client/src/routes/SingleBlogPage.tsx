// Fix for SingleBlogPage.tsx - Add alt text to content images
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
import { SEO } from '../components/SEO';

const SingleBlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!slug) navigate('/404');

    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          userState
            ? `${API_URL}/blogs/all/${slug}`
            : `${API_URL}/blogs/${slug}`
        );
        const blog = response.data?.blog || null;
        setBlog(blog);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return navigate('/404');
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Add alt text to images in content
  useEffect(() => {
    if (blog?.content) {
      const contentContainer = document.querySelector('.prose');
      if (contentContainer) {
        const images = contentContainer.querySelectorAll('img');
        images.forEach((img, index) => {
          if (!img.alt) {
            // Generate meaningful alt text based on context
            const figcaption = img
              .closest('figure')
              ?.querySelector('figcaption');
            const caption = figcaption?.textContent?.trim();

            if (caption) {
              img.alt = caption;
            } else {
              // Fallback alt text
              img.alt = `Image ${index + 1} from ${blog.title}`;
            }
          }

          // Add loading lazy for performance (except first image)
          if (index > 0) {
            img.loading = 'lazy';
            img.decoding = 'async';
          }

          // Add error handling
          img.onerror = () => {
            img.style.display = 'none';
            console.warn(`Failed to load image: ${img.src}`);
          };
        });
      }
    }
  }, [blog]);

  const handleChange = async (action: 'delete' | 'restore') => {
    try {
      const response =
        action === 'delete'
          ? await axios.delete(`${API_URL}/blogs/${action}/${slug}`)
          : await axios.patch(`${API_URL}/blogs/${action}/${slug}`);

      if (response.status.toString().startsWith('2')) {
        toast.success(response.data.message);
        setBlog({
          ...blog,
          isDeleted: action === 'delete' ? true : false,
        } as IPost);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <PostLoadingState />;
  if (!blog) return <NotFoundPage baseLink="/blogs" />;

  // Sanitize content before rendering
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  // Generate optimized image URL for hero image
  const getOptimizedImageUrl = (
    originalUrl: string,
    width: number,
    height: number
  ) => {
    if (originalUrl.includes('cloudinary.com')) {
      // Extract the base URL and add optimization parameters
      const parts = originalUrl.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${parts[1]}`;
      }
    }
    return originalUrl;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (originalUrl: string) => {
    if (originalUrl.includes('cloudinary.com')) {
      const parts = originalUrl.split('/upload/');
      if (parts.length === 2) {
        const base = `${parts[0]}/upload/f_auto,q_auto`;
        return [
          `${base},w_400,c_fill/${parts[1]} 400w`,
          `${base},w_800,c_fill/${parts[1]} 800w`,
          `${base},w_1200,c_fill/${parts[1]} 1200w`,
          `${base},w_1600,c_fill/${parts[1]} 1600w`,
        ].join(', ');
      }
    }
    return '';
  };

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.description}
        keywords={`${blog.categories.join(', ')}, travel, blog, empire report`}
        image={getOptimizedImageUrl(blog.image, 1200, 630)}
        url={`https://empire-reports.com/blogs/${blog.slug}`}
        type="article"
        author={blog.user.name}
        publishedTime={blog.createdAt.toString()}
        modifiedTime={blog.updatedAt?.toString()}
        categories={blog.categories}
        tags={blog.categories} // Use categories as tags for now
      />
      <PageWrapper>
        <article className="md:-mt-10 relative">
          {userState && (
            <div className="absolute -top-5 right-5 gap-3 flex">
              <button
                onClick={() =>
                  handleChange(blog.isDeleted ? 'restore' : 'delete')
                }
                className="hover:border-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out border-2 flex gap-0.5 items-center"
                aria-label={
                  blog.isDeleted ? 'Restore blog post' : 'Delete blog post'
                }
              >
                {blog.isDeleted ? (
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
                to={`/blogs/edit/${blog.slug}`}
                className="hover:border-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out border-2 flex gap-0.5 items-center"
                aria-label="Edit blog post"
              >
                <FiEdit className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full stroke-2" />
                <span>Edit</span>
              </Link>
            </div>
          )}

          <header>
            <div className="flex font-medium text-[#2c586a] items-center text-sm gap-1.5">
              <time dateTime={blog.createdAt.toString()}>
                {formatDate(blog.createdAt)}
              </time>
              <span className="text-sm">•</span>
              <span>By {blog.user.name}</span>
            </div>
            <h1 className="text-4xl font-bold text-[#2c586a] my-2">
              {blog.title}
            </h1>
            <p className="mb-5">{blog.description}</p>
          </header>

          <picture>
            <source
              srcSet={generateSrcSet(blog.image)}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 60vw"
            />
            <img
              src={getOptimizedImageUrl(blog.image, 800, 450)}
              alt={`Cover image for ${blog.title}`}
              className="mb-6 md:mb-10 w-full max-h-[67vh] rounded-lg shadow-md object-cover object-center"
              loading="eager"
              fetchPriority="high"
              width="800"
              height="450"
              onError={(e) => {
                // Fallback to original image if optimized version fails
                e.currentTarget.src = blog.image;
              }}
            />
          </picture>

          <div className="flex flex-col items-center gap-5">
            <div>
              <div
                className="prose prose-lg text-wrap prose-p:text-justify w-[90vw] md:max-w-[75vw] lg:max-w-[60vw]"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
              <div className="flex flex-wrap gap-2 mt-6">
                {blog.categories.length > 1 &&
                  blog.categories.map((category) => (
                    <Link
                      to={`/blogs?categories=${category}`}
                      key={category}
                      className="text-[#2c586a] text-sm font-medium hover:border-b-2 border-[#2c586a] transition-all ease-in-out flex gap-0.5 items-center"
                      aria-label={`View more posts in ${category} category`}
                    >
                      <HiHashtag />
                      <span>{category}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </article>
      </PageWrapper>
    </>
  );
};

export default SingleBlogPage;
