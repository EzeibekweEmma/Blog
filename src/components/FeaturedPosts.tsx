import BlogCard from './BlogCard';

const FeaturedPosts = () => {
  const blogs = ['', '', ''];

  return (
    blogs.length > 0 && (
      <div className="mt-4 flex flex-col md:flex-row gap-4 w-full justify-between">
        <div className="flex-[0.8] md:flex hidden">
          <BlogCard isFeatured />
        </div>
        <div className="flex md:hidden">
          <BlogCard />
        </div>
        {blogs.length > 1 && (
          <div className="flex-1 flex gap-4 flex-col justify-between">
            {blogs.slice(1).map((blog, index) => (
              <div key={index} className="">
                <BlogCard />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default FeaturedPosts;
