// src/components/RestaurantCard.jsx
import { Link } from 'react-router-dom';
import { Star, MapPin, UtensilsCrossed, Clock, Bike } from 'lucide-react';
import { useState, memo } from 'react';

const RestaurantCard = memo(({ data, index }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const showPlaceholder = imgError || !data.image;

  return (
    <div style={{ animationDelay: `${index * 20}ms` }} className="opacity-0 animate-fade-in-up restaurant-card">
      <Link to={`/restaurant/${data.id}`} className="block h-full">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 h-full flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-[transform,box-shadow] duration-200 will-change-transform">
        
        {/* --- Image Section --- */}
        <div className="relative h-32 lg:h-36 overflow-hidden bg-gray-100">
          {showPlaceholder ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center mb-1.5 shadow-sm">
                <UtensilsCrossed className="w-7 h-7 text-slate-400" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Restaurant</span>
            </div>
          ) : (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img
                src={data.image} 
                alt={data.name}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            </>
          )}
          
          {/* Discount Badge (Bottom Left) */}
          {data.discount && (
            <div className="absolute bottom-4 left-0 bg-yellow-400 text-slate-800 text-xs font-bold px-3 py-1 rounded-r-md shadow-md z-10">
              {data.discount} | Min: {data.minSpend}
            </div>
          )}
        </div>

        {/* --- Content Section --- */}
        <div className="p-4 flex flex-col flex-1">
          
          {/* Title & Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-gray-900 truncate pr-2 group-hover:text-slate-700 transition-colors">
              {data.name}
            </h3>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-800">{data.rating}</span>
              <span className="text-[10px] text-gray-400">({data.reviews})</span>
            </div>
          </div>

            {/* Meta Info - Address */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> 
              <span className="truncate">{data.address}</span>
            </div>

          {/* Delivery Info Row */}
          <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">{data.time || '30-45 mins'}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Bike className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">{data.deliveryFee || '₹40'}</span>
            </div>
            {data.distance && data.distance !== 'N/A' && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium">{data.distance}</span>
              </div>
            )}
          </div>

        </div>
      </div>
      </Link>
    </div>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

export default RestaurantCard;