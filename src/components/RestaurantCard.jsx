// src/components/RestaurantCard.jsx
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin } from 'lucide-react';

const RestaurantCard = ({ data }) => {
  return (
    <Link to={`/restaurant/${data.id}`} className="block h-full">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
        
        {/* --- Image Section --- */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={data.image} 
            alt={data.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount Badge (Bottom Left) */}
          {data.discount && (
            <div className="absolute bottom-4 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-r-md shadow-md z-10">
              {data.discount} | Min: {data.minSpend}
            </div>
          )}

          {/* Pre-order Overlay (Full Cover) */}
          {data.isPreOrder && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-20">
              <span className="text-white font-bold text-lg tracking-wide text-center px-4">
                Pre-order now for {data.preOrderTime}
              </span>
            </div>
          )}
        </div>

        {/* --- Content Section --- */}
        <div className="p-4 flex flex-col flex-1">
          
          {/* Title & Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate pr-2 group-hover:text-red-600 transition-colors">
              {data.name}
            </h3>
            <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 flex-shrink-0">
              <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
              <span className="text-xs font-bold text-gray-800">{data.rating}</span>
              <span className="text-[10px] text-gray-400">({data.reviews})</span>
            </div>
          </div>

          {/* Meta Info Line 1 (Icons) */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {data.distance}
            </span>
            {data.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {data.time}
              </span>
            )}
            {data.isPreOrder && (
               <span className="flex items-center gap-1 text-gray-600 font-medium">
                 <Bike className="w-3 h-3" /> Pre-order
               </span>
            )}
          </div>

          {/* Meta Info Line 2 (Footer - Pushed to bottom) */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            {!data.isPreOrder ? (
               <div className="flex items-center text-xs text-gray-500">
                  <span className="font-medium text-gray-700 mr-1">Delivery: {data.deliveryFee}</span>
                  <span className="text-gray-400">(min: {data.minOrder})</span>
               </div>
            ) : (
               <div className="text-xs text-red-500 font-medium">
                 Restaurant currently closed
               </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;