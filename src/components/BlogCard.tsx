import { Link } from 'react-router-dom';

const BlogCard = (props: { isFeatured?: boolean }) => {
  const { isFeatured } = props;
  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${
        isFeatured
          ? 'p-4 h-full'
          : 'sm:flex sm:gap-3 p-4 sm:p-2 sm:justify-between sm:items-center'
      }`}
    >
      {/* image */}
      <Link to="/blog/slug">
        <div
          className={`bg-[#2c586a] rounded-lg ${
            isFeatured ? 'h-52' : 'h-52 sm:h-40 sm:w-48'
          }`}
        />
      </Link>
      <div className={isFeatured ? 'mt-4' : 'mt-4 sm:mt-0'}>
        <Link
          to="/blog/slug"
          className="text-lg font-semibold text-[#2c586a] hover:underline"
        >
          Lorem ipsum dolor sit amet.
        </Link>
        <p className="text-sm mt-3">
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </span>
          <Link
            to="/blog/slug"
            className="text-sm text-[#2c586a] hover:underline ml-2"
          >
            Read more
          </Link>
        </p>
        <div className="flex items-center mt-2 text-xs gap-1.5 text-[#2c586a]/80">
          <span>By John</span>
          <span className="text-sm">•</span>
          <span>2 days ago</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
