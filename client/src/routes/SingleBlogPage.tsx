import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import PageWrapper from '../components/PageWrapper';
import { API_URL } from '../main';
import { IBlogPost } from '../interface';
import { formatDate } from '../utils';
import Aside from '../components/Aside';
import Cookies from 'js-cookie';

const SingleBlogView = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<IBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  useEffect(() => {
    if (!slug) return;

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
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10">No blog found</p>;

  // Sanitize content before rendering
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <PageWrapper>
      <div className="md:-mt-10">
        <div className="flex font-medium text-[#2c586a] items-center text-sm gap-1.5">
          <span>{formatDate(blog.createdAt)}</span>
          <span className="text-sm">•</span>
          <span>By John</span>
        </div>
        <h1 className="text-3xl font-bold text-[#2c586a] my-2">{blog.title}</h1>
        <p className="mb-5">{blog.description}</p>
        <img
          src={blog.image}
          alt="Blog Cover"
          className="mb-6 w-full max-w-h-[70vh] rounded-lg shadow-md"
        />
        <div className="flex gap-5">
          <div
            className="prose prose-lg text-wrap prose-p:text-justify md:flex-[0.9]"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <Aside />
        </div>
      </div>
    </PageWrapper>
  );
};

export default SingleBlogView;
