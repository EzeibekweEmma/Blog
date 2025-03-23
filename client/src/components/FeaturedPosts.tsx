import { IPost } from '../interface';
import Card from './Card';

const FeaturedPosts = (props: {
  post: IPost[];
  setPost: (post: IPost[]) => void;
}) => {
  const { post } = props;

  function setPost(post: IPost[]): void {
    props.setPost(post);
  }
  return (
    post.length > 0 && (
      <div className="pt-4 flex flex-col md:flex-row gap-4 w-full justify-between">
        <div className="flex-[0.8] md:flex hidden">
          <Card isFeatured post={post[0]} setPost={setPost} />
        </div>
        <div className="flex-1 md:hidden">
          <Card post={post[0]} setPost={setPost} />
        </div>
        {post.length > 1 && (
          <div className="flex-1 flex gap-4 flex-col justify-between">
            {post.slice(1).map((post, index) => {
              if (index < 2)
                return (
                  <div key={index} className="">
                    <Card post={post} setPost={setPost} />
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
