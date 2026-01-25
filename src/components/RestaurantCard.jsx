// src/components/RestaurantCard.jsx
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const RestaurantCard = ({ data, index = 0 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      <Link to={`/restaurant/${data.id}`} className="block h-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-xl overflow-hidden border border-gray-100 h-full flex flex-col group"
        >
        
        {/* --- Image Section --- */}
        <div className="relative h-32 lg:h-36 overflow-hidden">
          <LazyLoadImage
            src={data.image} 
            alt={data.name}
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount Badge (Bottom Left) */}
          {data.discount && (
            <div className="absolute bottom-4 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-r-md shadow-md z-10">
              {data.discount} | Min: {data.minSpend}
            </div>
          )}
        </div>

        {/* --- Content Section --- */}
        <div className="p-4 flex flex-col flex-1">
          
          {/* Title & Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-gray-900 truncate pr-2 group-hover:text-red-600 transition-colors">
              {data.name}
            </h3>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span className="text-xs font-bold text-gray-800">{data.rating}</span>
              <span className="text-[10px] text-gray-400">({data.reviews})</span>
            </div>
          </div>

          {/* Meta Info - Address */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5" /> 
            <span className="truncate">{data.address}</span>
          </div>

        </div>
      </motion.div>
      </Link>
    </div>
  );
};

export default RestaurantCard;