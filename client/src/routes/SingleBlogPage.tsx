import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import PageWrapper from '../components/PageWrapper';
import { API_URL } from '../main';
import { IBlogPost } from '../interface';
import { formatDate } from '../utils';
import Aside from '../components/Aside';

const SingleBlogView = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<IBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs/${slug}`, {
          withCredentials: true,
        });
        if (response.status.toString().startsWith('2')) {
          setBlog(response.data.blog);
        }
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
  const sanitizedContent = DOMPurify.sanitize(blog.content, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'blockquote',
      'img',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'style'],
  });

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
          className="mb-6 w-full mix-w-h-[70vh] rounded-lg shadow-md"
        />
        <div className="flex gap-5">
          <div
            className="prose prose-lg text-wrap text-justify md:flex-[0.9]"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          <Aside />
        </div>
      </div>
    </PageWrapper>
  );
};

export default SingleBlogView;
