const RestaurantDetailsSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full bg-gray-300"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-20 z-10">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-200 p-2 rounded-xl w-20 h-20"></div>
            
            <div className="mt-8 text-center md:text-left">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto md:mx-0 mb-4"></div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-100 h-12"></div>
              <div className="space-y-3 p-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Menu Items Skeleton */}
          <div className="flex-1 space-y-8">
            {[1, 2].map((section) => (
              <div key={section}>
                <div className="bg-gray-100 border-l-4 border-gray-300 px-4 py-3 mb-4 rounded-r-lg">
                  <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                        <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsSkeleton;
