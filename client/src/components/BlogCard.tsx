import { Link, useLocation } from 'react-router-dom';
import { IBlogPost } from '../interface';
import { getDaysAgo } from '../utils';
import {
  IoHeartOutline,
  IoHeartSharp,
  IoTrashBinOutline,
  IoTrashBinSharp,
} from 'react-icons/io5';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../main';

const BlogCard = ({
  isFeatured,
  blog,
  setBlogs,
}: {
  isFeatured?: boolean;
  blog: IBlogPost;
  setBlogs: (blogs: IBlogPost[]) => void;
}) => {
  const location = useLocation();
  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  const handleDelete = async (option: boolean) => {
    try {
      const response = option
        ? await axios.delete(`${API_URL}/blogs/delete/${blog.slug}`)
        : await axios.patch(`${API_URL}/blogs/restore/${blog.slug}`);

      if (response.status.toString().startsWith('2')) {
        toast.success(response.data.message);

        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b.slug === blog.slug ? { ...b, isDeleted: option } : b
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong!');
      }
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg relative hover:shadow-xl transition-all ease-in-out transform hover:-translate-y-1
         ${
           isFeatured
             ? 'p-4 h-full w-full'
             : 'sm:flex sm:gap-3 p-4 sm:p-2 sm:justify-between sm:items-center'
         }`}
    >
      {userState && location.pathname !== '/' && (
        <div className="absolute top-5 right-5 flex gap-1.5">
          {blog.isFeatured ? (
            <button>
              <IoHeartSharp className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
            </button>
          ) : (
            <button>
              <IoHeartOutline className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
            </button>
          )}
          {blog.isDeleted ? (
            <button onClick={() => handleDelete(false)}>
              <IoTrashBinSharp className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
            </button>
          ) : (
            <button onClick={() => handleDelete(true)}>
              <IoTrashBinOutline className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
            </button>
          )}
        </div>
      )}
      {/* <div className="absolute bottom-5 right-5 flex gap-1.5">
        <button>
          <IoBookmark className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
        </button>
        <button>
          <IoBookmarkOutline className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
        </button>
      </div> */}
      {/* image */}
      <Link to={`/blogs/${blog.slug}`} className="sm:flex-[0.4]">
        <img
          src={blog.image}
          alt={blog.title}
          className={`object-cover object-center rounded-lg h-52 ${
            isFeatured ? 'w-full' : 'sm:h-40 sm:w-48 w-full'
          }`}
        />
      </Link>

      <div className={isFeatured ? 'mt-4' : 'mt-4 sm:mt-0 sm:flex-1'}>
        <Link
          to={`/blogs/${blog.slug}`}
          className="text-lg font-semibold text-[#2c586a] hover:underline"
        >
          {blog.title}
        </Link>
        <p className="text-sm mt-3">
          <span>
            {blog.description.length > 120
              ? blog.description.slice(0, 120) + '...'
              : blog.description}
          </span>
          <Link
            to={`/blogs/${blog.slug}`}
            className="text-sm text-[#2c586a] hover:underline ml-2"
          >
            Read more
          </Link>
        </p>
        <div className="flex items-center mt-2 text-xs gap-1.5 text-[#2c586a]/80">
          <span>By John</span>
          <span className="text-sm">•</span>
          <span>{getDaysAgo(blog.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
