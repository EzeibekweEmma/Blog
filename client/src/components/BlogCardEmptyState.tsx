const BlogCardEmpty = ({ isFeatured }: { isFeatured?: boolean }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg animate-pulse ${
        isFeatured
          ? 'p-4 h-full'
          : 'sm:flex sm:gap-3 p-4 sm:p-2 sm:justify-between sm:items-center'
      }`}
    >
      {/* Image Placeholder */}
      <div
        className={`bg-gray-300 rounded-lg ${
          isFeatured ? 'h-52' : 'h-52 sm:h-40 sm:w-48'
        }`}
      />

      {/* Text Placeholder */}
      <div className={isFeatured ? 'mt-4' : 'mt-4 sm:mt-0 w-full'}>
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>

        {/* Metadata Placeholder */}
        <div className="flex items-center mt-3 text-xs gap-1.5 text-gray-400">
          <div className="h-3 bg-gray-300 rounded w-16"></div>
          <span className="text-sm">•</span>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardEmpty;
