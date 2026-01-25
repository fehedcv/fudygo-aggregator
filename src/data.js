// src/data.js
export const categories = [
  { name: 'Groceries', image: '/grocery.png' },
  { name: 'Burgers', image: '/burger.png' },
  { name: 'Pizza', image: '/pizza.png' },
  { name: 'Kebab', image: '/kebab.png' },
  { name: 'Grill', image: '/grill.png' },
  { name: 'Curry', image: '/curry.png' },
];
export const restaurants = [
  {
    id: 1,
    name: "Aberaman Fish bar & Kebab",
    slug: "aberaman-fish-bar",
    address: "6 Lewis St, Aberdare",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=60",
    logo: "https://cdn-icons-png.flaticon.com/512/732/732217.png",
    rating: 4.6,
    reviews: 81,
    distance: "3.69 mi",
    time: "40 mins",
    deliveryFee: "£4.50",
    minOrder: "£10",
    discount: "10% OFF",
    minSpend: "£20.80",
    categories: ["Chips", "Cod", "Savories", "Burgers", "Kebabs", "Wraps", "Sauce", "Chicken"],
    menu: {
      Chips: [
        { name: "Small Chips", price: "3.30" },
        { name: "Large Chips", price: "3.95" },
        { name: "Small Chips & Curry", price: "3.80" },
        { name: "Large Chips & Curry", price: "4.85" },
        { name: "Small Chips & Cheese", price: "3.80" },
        { name: "Large Chips & Cheese", price: "4.85" },
      ],
      Cod: [
        { name: "Regular Cod", price: "6.50", desc: "Freshly battered cod" },
        { name: "Large Cod", price: "8.50", desc: "Large fillet of flaky cod" },
        { name: "Cod Bites (5)", price: "5.50" },
      ]
    }
  },

  // ----------------------------------------------------------------------

  {
    id: 2,
    name: "Cymru Chippy",
    slug: "cymru-chippy",
    address: "21 Jubilee Rd, Aberdare",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=1200&auto=format&fit=crop&q=60",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    rating: 4.0,
    reviews: 28,
    distance: "4.93 mi",
    time: "45 mins",
    deliveryFee: "£4.75",
    minOrder: "£15",
    discount: "25% OFF",
    minSpend: "£15.60",
    categories: ["Fish", "Chips", "Burgers", "Sausages", "Kids Meals"],
    menu: {
      Fish: [
        { name: "Haddock", price: "7.20" },
        { name: "Cod Fillet", price: "6.90" },
      ],
      Chips: [
        { name: "Chips (Small)", price: "3.20" },
        { name: "Chips (Large)", price: "4.40" },
      ],
      Burgers: [
        { name: "Beef Burger", price: "4.90" },
        { name: "Cheese Burger", price: "5.30" },
      ]
    }
  },

  // ----------------------------------------------------------------------

  {
    id: 3,
    name: "Mama's Fish And Chips",
    slug: "mamas-fish-and-chips",
    address: "44 High St, Aberdare",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF2A3KoGD7X9E8RwCqzzd58f2MwR9hzgakGA&s",
    logo: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    rating: 4.3,
    reviews: 300,
    distance: "5.36 mi",
    time: "60 mins",
    deliveryFee: "£4.00",
    minOrder: "£15",
    categories: ["Fish", "Chips", "Pies", "Sausages", "Extras"],
    menu: {
      Fish: [
        { name: "Cod", price: "6.80" },
        { name: "Plaice", price: "7.20" },
      ],
      Pies: [
        { name: "Beef & Onion Pie", price: "3.90" },
        { name: "Chicken & Mushroom Pie", price: "4.10" },
      ]
    }
  },

  // ----------------------------------------------------------------------

  {
    id: 4,
    name: "Kyber Kebab",
    slug: "kyber-kebab",
    address: "Market St, Aberdare",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1200&auto=format&fit=crop&q=60",
    logo: "https://cdn-icons-png.flaticon.com/512/933/933310.png",
    rating: 4.8,
    reviews: 2000,
    distance: "0.10 mi",
    isPreOrder: true,
    preOrderTime: "3:40 PM",
    categories: ["Kebabs", "Wraps", "Grill", "Sides"],
    menu: {
      Kebabs: [
        { name: "Doner Kebab", price: "6.20" },
        { name: "Chicken Kebab", price: "6.90" },
      ],
      Wraps: [
        { name: "Chicken Wrap", price: "5.50" },
        { name: "Mixed Wrap", price: "6.20" },
      ]
    }
  },

  // ----------------------------------------------------------------------

  {
    id: 5,
    name: "The Souvlaki Grill",
    slug: "the-souvlaki-grill",
    address: "Cardiff Rd, Aberdare",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=60",
    logo: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png",
    rating: 4.8,
    reviews: 200,
    distance: "0.18 mi",
    isPreOrder: true,
    preOrderTime: "4:30 PM",
    categories: ["Greek", "Grill", "Souvlaki", "Sides"],
    menu: {
      Souvlaki: [
        { name: "Chicken Souvlaki", price: "7.40" },
        { name: "Pork Souvlaki", price: "7.20" },
      ],
      Grill: [
        { name: "Mixed Grill Box", price: "12.50" },
      ]
    }
  },

  // ----------------------------------------------------------------------

  {
    id: 6,
    name: "JIBS",
    slug: "jibs",
    address: "Cwmbach Rd, Aberdare",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Fish_and_chips_blackpool.jpg",
    logo: "https://cdn-icons-png.flaticon.com/512/2276/2276931.png",
    rating: 4.5,
    reviews: 120,
    distance: "0.65 mi",
    isPreOrder: true,
    preOrderTime: "4:30 PM",
    categories: ["Indian", "Curry", "Grill", "Bread"],
    menu: {
      Curry: [
        { name: "Butter Chicken", price: "8.50" },
        { name: "Chicken Tikka Masala", price: "8.90" },
      ],
      Bread: [
        { name: "Garlic Naan", price: "2.50" },
        { name: "Plain Naan", price: "2.20" },
      ]
    }
  }
];
