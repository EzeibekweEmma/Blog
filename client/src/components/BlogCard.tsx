import { Link } from 'react-router-dom';
import { IBlogPost } from '../interface';
import { getDaysAgo } from '../utils';

const BlogCard = (props: { isFeatured?: boolean; blog: IBlogPost }) => {
  const { isFeatured, blog } = props;

  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${
        isFeatured
          ? 'p-4 h-full w-full'
          : 'sm:flex sm:gap-3 p-4 sm:p-2 sm:justify-between sm:items-center'
      }`}
    >
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
