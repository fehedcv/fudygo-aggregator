const CartSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 sm:px-6 lg:px-8 font-sans pb-24 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded"></div>
          <div className="h-6 md:h-7 w-28 bg-gray-300 rounded-lg"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Order From Restaurant Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Restaurant Header */}
              <div className="p-3 md:p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 md:h-5 w-40 md:w-52 bg-gray-300 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-green-100 rounded-full"></div>
              </div>

              {/* Cart Item Rows */}
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-3 md:p-4 flex items-center justify-between">
                    {/* Item Name & Price */}
                    <div className="flex-1 pr-4 space-y-1.5">
                      <div className="h-4 md:h-5 bg-gray-300 rounded w-28 md:w-36"></div>
                      <div className="h-3 md:h-4 bg-gray-200 rounded w-14 md:w-16"></div>
                    </div>
                    {/* Quantity Controls & Total */}
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-0.5 md:p-1 border border-gray-100">
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-white rounded shadow-sm"></div>
                        <div className="w-4 md:w-5 h-4 bg-gray-200 rounded"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 bg-white rounded shadow-sm"></div>
                      </div>
                      <div className="h-4 w-12 md:w-16 bg-gray-200 rounded"></div>
                      <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
              <div className="h-4 bg-gray-300 rounded w-36 mb-2"></div>
              <div className="h-16 md:h-20 bg-gray-100 rounded-lg border border-gray-200"></div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="w-full lg:w-96 space-y-4 md:space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 md:h-5 bg-gray-300 rounded w-32"></div>
                <div className="h-6 w-16 bg-red-100 rounded-full"></div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="w-9 h-9 bg-white rounded-full shadow-sm shrink-0"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="h-4 md:h-5 bg-gray-300 rounded w-36 mb-4"></div>
              <div className="space-y-2.5 md:space-y-3 mb-5 md:mb-6">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-14"></div>
                </div>
                {/* Delivery Fee */}
                <div className="flex justify-between">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-12"></div>
                </div>
                {/* Service Fee */}
                <div className="flex justify-between">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-18"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-12"></div>
                </div>
                {/* Total */}
                <div className="border-t border-dashed border-gray-200 pt-3 md:pt-4 flex justify-between items-end">
                  <div className="h-4 md:h-5 bg-gray-300 rounded w-12"></div>
                  <div className="text-right space-y-1">
                    <div className="h-6 md:h-8 bg-gray-300 rounded w-24 ml-auto"></div>
                    <div className="h-2.5 bg-gray-200 rounded w-16 ml-auto"></div>
                  </div>
                </div>
              </div>
              {/* Place Order Button */}
              <div className="h-12 md:h-14 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
