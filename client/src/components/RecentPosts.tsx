import { Link } from 'react-router-dom';
import { IPost } from '../interface';
import Card from './Card';

const RecentPosts = (props: { post: IPost[]; title: string }) => {
  const { post, title } = props;

  return (
    post.length > 0 && (
      <div>
        <h1 className="mt-8 mb-4 text-2xl text-gray-600">Recent {title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {post.map((post, index) => (
            <div key={index}>
              <Card isFeatured post={post} />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to={`/${title.toLowerCase()}`}
            className="bg-[#2c586a] text-[#f3f8f6] font-semibold py-3 px-4 rounded-3xl border-[#2c586a] border hover:bg-white hover:text-[#2c586a]"
          >
            See More {title}
          </Link>
        </div>
      </div>
    )
  );
};

export default RecentPosts;
