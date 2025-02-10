import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageWrapper from '../components/pageWrapper';

const SingleBlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`your-backend-api-url/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!blog) return <p className="text-center mt-10">No blog found</p>;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 min-h-[70vh]">
        <h1 className="text-3xl font-bold text-[#2c586a] mb-6">{blog.title}</h1>
        {blog.image && (
          <img
            src={blog.image}
            alt="Blog Cover"
            className="mb-6 w-full rounded-lg shadow-md"
          />
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </PageWrapper>
  );
};

export default SingleBlogView;
