const HomeSkeleton = () => {
  return (
    <div className="w-full px-6 lg:px-12 py-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Sort By Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="h-5 bg-gray-300 rounded w-20 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>

            {/* Filter By Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Delivery/Pickup Toggle Skeleton */}
          <div className="h-12 bg-gray-200 rounded-full mb-6 w-full lg:w-80"></div>

          {/* Search Bar Skeleton */}
          <div className="h-14 bg-gray-200 rounded-xl mb-6"></div>

          {/* Restaurant Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Image Skeleton */}
                <div className="w-full h-32 lg:h-36 bg-gray-300"></div>
                
                {/* Content Skeleton */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-5 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
