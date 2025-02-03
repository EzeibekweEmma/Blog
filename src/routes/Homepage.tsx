import PageWrapper from '../components/pageWrapper';
import MainCategories from '../components/MainCategories';
import FeaturedPosts from '../components/FeaturedPosts';
import BlogCard from '../components/BlogCard';

const Homepage = () => {
  const blogs = ['', '', '', '', '', '', '', '', '', ''];
  return (
    <PageWrapper>
      <div className="mt-4 flex flex-col gap-4">
        {/* INTRODUCTION */}
        <div className="flex items-center justify-between my-5">
          {/* titles */}
          <div className="">
            <h1 className="text-[#2c586a] text-2xl md:text-5xl lg:text-6xl font-bold max-w-3xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </h1>
            <p className="mt-8 text-md md:text-xl">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
              rerum accusantium.
            </p>
          </div>
          {/* animated button */}
          <div className="hidden md:block relative">
            <svg
              viewBox="0 0 200 200"
              width="200"
              height="200"
              className="text-lg tracking-widest"
            >
              <path
                id="circlePath"
                fill="none"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
              <text>
                <textPath href="#circlePath" startOffset="0%">
                  Write your story •
                </textPath>
                <textPath href="#circlePath" startOffset="50%">
                  Share your idea •
                </textPath>
              </text>
            </svg>
            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-[#2c586a] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <line x1="6" y1="18" x2="18" y2="6" />
                <polyline points="9 6 18 6 18 15" />
              </svg>
            </div>
          </div>
        </div>
        <MainCategories />
        <FeaturedPosts />
        {/* Blog post lists */}
        <div>
          <h1 className="mt-8 mb-4 text-2xl text-gray-600">Recent Blogs</h1>
          {blogs.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
              {blogs.map((blog, index) => (
                <div key={index} className="">
                  <BlogCard isFeatured />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Homepage;
