import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import PageWrapper from '../components/PageWrapper';
import { API_URL } from '../main';
import { IBlogPost } from '../interface';

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
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
        <h1 className="text-3xl font-bold text-[#2c586a] mb-6">{blog.title}</h1>
        <p className="text-gray-600 mb-4">{blog.description}</p>
        <img
          src={blog.image}
          alt="Blog Cover"
          className="mb-6 w-full rounded-lg shadow-md"
        />
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </PageWrapper>
  );
};

export default SingleBlogView;
