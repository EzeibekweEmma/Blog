import { Link } from 'react-router-dom';

const BlogCard = (props: { isFeatured?: boolean }) => {
  const { isFeatured } = props;
  return (
    <div
      className={`bg-white rounded-lg shadow-lg ${
        isFeatured
          ? 'p-4 h-full'
          : 'flex gap-3 p-2 justify-between items-center'
      }`}
    >
      {/* image */}
      <div
        className={`bg-[#2c586a] rounded-lg ${
          isFeatured ? 'h-52' : 'h-40 w-48'
        }`}
      />
      <div className={isFeatured ? 'mt-4' : ''}>
        <Link
          to="/blog"
          className="text-lg font-semibold text-[#2c586a] hover:underline"
        >
          Lorem ipsum dolor sit amet.
        </Link>
        <p className="text-sm mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <div className="flex items-center mt-3 text-sm gap-3">
          <Link to="/blog" className="text-[#2c586a] hover:underline">
            Read More
          </Link>
          <span>•</span>
          <span className="text-xs">2 days ago</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
