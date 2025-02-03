import PageWrapper from '../components/pageWrapper';
import MainCategories from '../components/MainCategories';
import BlogCard from '../components/BlogCard';
import Search from '../components/Search';

const BlogListPage = () => {
  const blogs = ['', '', '', '', '', '', '', '', '', ''];
  return (
    <PageWrapper>
      <div className="mt-8">
        <MainCategories />
        <span className="md:hidden">
          <Search />
        </span>
        {/* Blog post lists */}
        {blogs.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20 mt-8">
            {blogs.map((blog, index) => (
              <div key={index} className="">
                <BlogCard isFeatured />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BlogListPage;
