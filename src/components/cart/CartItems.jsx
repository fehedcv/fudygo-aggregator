import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartItems = ({ cart, updateQuantity, removeFromCart, instructions, setInstructions }) => {
  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600" />
            </div>
            <h2 className="font-bold text-gray-800 text-sm md:text-base truncate">Order from {cart.restaurantName}</h2>
          </div>
          <span className="text-[10px] md:text-xs font-bold text-green-700 bg-green-50 px-2 md:px-2.5 py-1 rounded-full border border-green-100 whitespace-nowrap">
            20-30 mins
          </span>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {cart.items.map((item, idx) => (
            <div key={idx} className="p-3 md:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex-1 pr-2 md:pr-4 min-w-0">
                <h3 className="font-bold text-gray-800 mb-0.5 text-sm md:text-base truncate">{item.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 font-medium">₹{item.price}</p>
              </div>

              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 rounded-lg p-0.5 md:p-1 border border-gray-100">
                  <button onClick={() => updateQuantity(item.name, -1)} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600 disabled:opacity-50 transition-colors">
                    <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={2.5} />
                  </button>
                  <span className="text-xs md:text-sm font-bold w-4 md:w-5 text-center text-gray-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.name, 1)} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600 transition-colors">
                    <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={2.5} />
                  </button>
                </div>
                <span className="font-bold text-gray-800 w-12 md:w-16 text-right tabular-nums text-xs md:text-sm">
                  ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                </span>
                <button onClick={() => removeFromCart(item.name)} className="text-gray-300 hover:text-red-500 p-1.5 md:p-2 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
        <h3 className="font-bold text-gray-800 mb-2 text-xs md:text-sm">Delivery Instructions</h3>
        <textarea 
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Leave at front door, ring doorbell..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 md:p-3 text-xs md:text-sm focus:ring-2 focus:ring-red-100 focus:border-red-200 outline-none transition-all resize-none h-16 md:h-20"
        ></textarea>
      </div>
    </div>
  );
};

export default CartItems;