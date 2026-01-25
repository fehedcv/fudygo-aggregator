const CartSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-5xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Skeleton */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-4 flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-300 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
                      <div className="h-5 w-16 bg-gray-200 rounded"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="h-5 bg-gray-300 rounded w-40 mb-2"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="h-8 bg-gray-300 rounded w-32 ml-auto"></div>
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
