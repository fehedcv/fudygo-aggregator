export const SORT_OPTIONS = [
  { value: 'distance',      label: 'Nearest First',       shortLabel: 'Nearest'   },
  { value: 'rating',        label: 'Top Rated',            shortLabel: 'Top Rated' },
  { value: 'delivery_time', label: 'Fastest Delivery',     shortLabel: 'Fastest'   },
  { value: 'popularity',    label: 'Most Popular',         shortLabel: 'Popular'   },
  { value: 'delivery_fee',  label: 'Lowest Delivery Fee',  shortLabel: 'Low Fee'   },
  { value: 'min_order',     label: 'Lowest Min. Order',    shortLabel: 'Low Min.'  },
];

export const FILTER_OPTIONS = [
  { value: 'free_delivery', label: 'Free Delivery'  },
  { value: 'top_rated',     label: '4+ Stars'       },
  { value: 'fast_delivery', label: 'Fast (≤30 min)' },
];
