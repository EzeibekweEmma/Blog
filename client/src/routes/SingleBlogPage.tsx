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

const SingleBlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  useEffect(() => {
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
  if (!blog) return;

  // Sanitize content before rendering
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <PageWrapper>
      <div className="md:-mt-10 relative">
        {userState && (
          <div className="absolute -top-5 right-5 gap-3 flex">
            <button
              onClick={() =>
                handleChange(blog.isDeleted ? 'restore' : 'delete')
              }
              className="hover:border-[#2c586a] px-2 py-1 rounded-md transition-all ease-in-out border-2 flex gap-0.5 items-center"
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
            >
              <FiEdit className="text-2xl h-7 w-7 p-1 text-[#2c586a] rounded-full stroke-2" />
              <span>Edit</span>
            </Link>
          </div>
        )}

        <div className="flex font-medium text-[#2c586a] items-center text-sm gap-1.5">
          <span>{formatDate(blog.createdAt)}</span>
          <span className="text-sm">•</span>
          <span>By {blog.user.name}</span>
        </div>
        <h1 className="text-4xl font-bold text-[#2c586a] my-2">{blog.title}</h1>
        <p className="mb-5">{blog.description}</p>
        <img
          src={blog.image}
          alt="Blog Cover"
          className="mb-6 md:mb-10 w-full max-h-[67vh] rounded-lg shadow-md object-cover object-center"
        />
        <div className="flex flex-col items-center gap-5">
          <div>
            <div
              className="prose prose-lg text-wrap prose-p:text-justify w-[90vw] md:max-w-[75vw] lg:max-w-[60vw]"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <div className="flex flex-wrap gap-2">
              {blog.categories.length > 1 &&
                blog.categories.map((category) => (
                  <Link
                    to={`/blogs?categories=${category}`}
                    key={category}
                    className="text-[#2c586a] text-sm font-medium hover:border-b-2 border-[#2c586a] transition-all ease-in-out flex gap-0.5 items-center"
                  >
                    <HiHashtag />
                    <span>{category}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SingleBlogPage;
