import { X } from 'lucide-react';
import { categories } from '../data';

const FilterDrawer = ({ isOpen, onClose }) => {
  const sortOptions = ['Best Match', 'Distance', 'Rating', 'Delivery Time', 'Min Order', 'Discount'];
  const filterOptions = ['4+ Stars', 'Free Delivery', 'Offers', 'Under £15', 'Hygiene Rating 3+'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] xl:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl p-6 h-[85vh] overflow-y-auto flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Sort & Filter</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8 overflow-y-auto pb-20 custom-scrollbar">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((item, idx) => (
                <button key={idx} className={`px-4 py-2 text-sm rounded-full border transition-all ${item === 'Distance' ? 'bg-red-50 border-red-500 text-red-600 font-bold' : 'bg-white border-gray-200 text-gray-600'}`}>{item}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">Filter By</h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((item, idx) => (
                <button key={idx} className="px-4 py-2 text-sm rounded-full border bg-white border-gray-200 text-gray-600 hover:border-gray-300">{item}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="grid grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-orange-50 p-2 mb-2"><img src={cat.image} alt={cat.name} className="w-full h-full object-contain" /></div>
                  <span className="text-[10px] text-center font-medium text-gray-700 leading-tight">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button onClick={onClose} className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Show Results</button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;