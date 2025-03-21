import { IBlogPost } from '../interface';
import BlogCard from './BlogCard';

const FeaturedPosts = (props: {
  blog: IBlogPost[];
  setBlogs: (blogs: IBlogPost[]) => void;
}) => {
  const { blog } = props;

  function setBlogs(blogs: IBlogPost[]): void {
    props.setBlogs(blogs);
  }
  return (
    blog.length > 0 && (
      <div className="pt-4 flex flex-col md:flex-row gap-4 w-full justify-between">
        <div className="flex-[0.8] md:flex hidden">
          <BlogCard isFeatured blog={blog[0]} setBlogs={setBlogs} />
        </div>
        <div className="flex-1 md:hidden">
          <BlogCard blog={blog[0]} setBlogs={setBlogs} />
        </div>
        {blog.length > 1 && (
          <div className="flex-1 flex gap-4 flex-col justify-between">
            {blog.slice(1).map((blog, index) => {
              if (index < 2)
                return (
                  <div key={index} className="">
                    <BlogCard blog={blog} setBlogs={setBlogs} />
                  </div>
                );
            })}
          </div>
        )}
      </div>
    )
  );
};

export default FeaturedPosts;
