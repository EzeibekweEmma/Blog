import { Link } from 'react-router-dom';
import { IBlogPost } from '../interface';

const BlogCard = (props: { isFeatured?: boolean; blog: IBlogPost }) => {
  const { isFeatured, blog } = props;

  const getDaysAgo = (createdAt: Date) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const differenceInTime = now.getTime() - createdDate.getTime();
    const differenceInDays = Math.floor(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    const res =
      differenceInTime < 1000 * 60
        ? 'Just now'
        : differenceInTime < 1000 * 60 * 60
        ? Math.floor(differenceInTime / (1000 * 60)) + ' minutes ago'
        : differenceInDays < 1
        ? Math.floor(differenceInTime / (1000 * 60 * 60)) + ' hours ago'
        : differenceInDays > 1
        ? 'A day ago'
        : differenceInDays + ' days ago';
    return res;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${
        isFeatured
          ? 'p-4 h-full w-full'
          : 'sm:flex sm:gap-3 p-4 sm:p-2 sm:justify-between sm:items-center'
      }`}
    >
      {/* image */}
      <Link to={`/blogs/${blog.slug}`}>
        <img
          src={blog.image}
          alt={blog.title}
          className={`rounded-lg ${
            isFeatured
              ? 'object-cover object-center w-full h-52'
              : 'h-52 sm:h-40 sm:w-48'
          }`}
        />
      </Link>
      <div className={isFeatured ? 'mt-4' : 'mt-4 sm:mt-0'}>
        <Link
          to={`/blogs/${blog.slug}`}
          className="text-lg font-semibold text-[#2c586a] hover:underline"
        >
          {blog.title}
        </Link>
        <p className="text-sm mt-3">
          <span>{blog.description}</span>
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
