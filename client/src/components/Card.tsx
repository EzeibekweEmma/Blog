import { Link, useLocation } from 'react-router-dom';
import { IPost } from '../interface';
import { formatNumber, timeAgo } from '../utils';
import {
  IoHeartOutline,
  IoHeartSharp,
  IoTrashBinOutline,
} from 'react-icons/io5';
import { MdSettingsBackupRestore } from 'react-icons/md';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../main';
import { FaRegEye } from 'react-icons/fa';

const Card = ({
  isFeatured,
  post,
  setPost,
  type,
}: {
  isFeatured?: boolean;
  post: IPost;
  setPost?: React.Dispatch<React.SetStateAction<IPost[]>>;
  type?: 'blogs' | 'news';
}) => {
  const location = useLocation();
  const path = type
    ? type
    : location.pathname.includes('/news')
    ? 'news'
    : 'blogs';
  const userState = Cookies.get('userDetails')
    ? JSON.parse(Cookies.get('userDetails') || '{}')
    : null;

  const handleChange = async (
    option: boolean,
    action: 'handleDelete' | 'handleIsFeatured'
  ) => {
    try {
      const endpoint =
        action === 'handleDelete'
          ? option
            ? `${API_URL}/${path}/delete/${post.slug}`
            : `${API_URL}/${path}/restore/${post.slug}`
          : `${API_URL}/${path}/edit/${post.slug}`;

      const method =
        action === 'handleIsFeatured' ? 'put' : option ? 'delete' : 'patch';
      const data = action === 'handleIsFeatured' ? { isFeatured: option } : {};

      const response = await axios({ method, url: endpoint, data });

      if (response.status.toString().startsWith('2')) {
        toast.success(response.data.message);

        const updatePost =
          action === 'handleIsFeatured'
            ? { ...post, isFeatured: option }
            : { ...post, isDeleted: option, isFeatured: false };

        if (setPost) {
          setPost((prevPosts: IPost[]) =>
            prevPosts.map((b: IPost) => (b.slug === post.slug ? updatePost : b))
          );
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong!');
      }
      console.error('Error deleting post:', error);
    }
  };

  const truncatedDescription =
    post.description.length > 120
      ? post.description.slice(0, 120) + '...'
      : post.description;

  return (
    <article
      className={`bg-white rounded-lg shadow-lg relative hover:shadow-xl transition-all ease-in-out transform hover:-translate-y-1
         ${
           isFeatured
             ? 'p-4 h-full w-full sm:max-w-[450px]'
             : 'sm:flex sm:gap-3 p-4 sm:p-2 sm:justify-between sm:items-center'
         }`}
    >
      {userState && location.pathname !== '/' && (
        <div className="absolute top-5 right-5 flex gap-1.5">
          {!post.isDeleted &&
            post.isPublished &&
            (post.isFeatured ? (
              <button
                onClick={() => handleChange(false, 'handleIsFeatured')}
                aria-label="Remove from featured posts"
              >
                <IoHeartSharp className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
              </button>
            ) : (
              <button
                onClick={() => handleChange(true, 'handleIsFeatured')}
                aria-label="Add to featured posts"
              >
                <IoHeartOutline className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70 stroke-2" />
              </button>
            ))}
          {post.isDeleted ? (
            <button
              onClick={() => handleChange(false, 'handleDelete')}
              aria-label="Restore post"
            >
              <MdSettingsBackupRestore className="text-2xl bg-[#f3f8f6] h-7 w-7 p-1 text-[#2c586a] rounded-full hover:bg-[#f3f8f6]/70" />
            </button>
          ) : (
            <button
              onClick={() => handleChange(true, 'handleDelete')}
              aria-label="Delete post"
            >
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
      <Link to={`/${path}/${post.slug}`} className="sm:flex-[0.4]">
        <img
          src={post.image}
          alt={`Cover image for ${post.title}`}
          className={`object-cover object-center rounded-lg h-52 ${
            isFeatured ? 'w-full' : 'sm:h-40 sm:w-48 w-full'
          }`}
          loading="lazy"
          decoding="async"
        />
      </Link>

      <div className={isFeatured ? 'mt-4' : 'mt-4 sm:mt-0 sm:flex-1'}>
        <Link
          to={`/${path}/${post.slug}`}
          className="text-lg font-semibold text-[#2c586a] hover:underline"
          aria-label={`Read full article: ${post.title}`}
        >
          <h2>{post.title}</h2>
        </Link>
        <p className="text-sm mt-3">
          <span>{truncatedDescription}</span>
          <Link
            to={`/${path}/${post.slug}`}
            className="text-sm text-[#2c586a] hover:underline ml-2"
            aria-label={`Continue reading ${post.title}`}
          >
            Read more
          </Link>
        </p>
        <div className="flex justify-between items-center mt-2 text-xs gap-1.5 text-[#2c586a]/80">
          <div className="flex gap-1.5 items-center">
            <span>By {post.user.name}</span>
            <span className="text-sm">•</span>
            <time dateTime={post.createdAt.toString()}>
              {timeAgo(post.createdAt)}
            </time>
          </div>
          {userState && location.pathname !== '/' && (
            <div
              className="flex gap-1.5 items-center"
              aria-label={`${formatNumber(post.visit!)} views`}
            >
              <FaRegEye />
              <span>{formatNumber(post.visit!)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Card;
