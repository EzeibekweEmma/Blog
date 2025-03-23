const PostLoadingState = () => {
  return (
    <div className="animate-pulse my-10 mx-10 md:mx-16 lg:mx-20">
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <span className="text-sm">•</span>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>

      <div className="h-10 w-[80%] bg-gray-300 rounded mt-3"></div>
      <div className="h-5 w-[90%] bg-gray-300 rounded mt-2"></div>

      <div className="h-[250px] md:h-[67vh] w-full bg-gray-300 rounded-lg shadow-md mt-5"></div>

      <div className="flex flex-col items-center gap-5 mt-5">
        <div className="w-[80vw] md:max-w-[75vw] lg:max-w-[60vw] space-y-4">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-[80%] bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-[80%] bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PostLoadingState;
