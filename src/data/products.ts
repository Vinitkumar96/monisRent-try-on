export interface Product {
  id: string;
  name: string;
  category: 'table' | 'chair' | 'monitor' | 'stand' | 'laptop' | 'sidetable' | 'accessories';
  price: number; // Price in USD per week
  description: string;
  details: string[];
  image: string; // Path inside public directory, e.g. /table/tableblack.png
  visualInfo: {
    width: number;
    height: number;
    defaultX: number; // relative offset X
    defaultY: number; // relative offset Y
    zIndex: number;
  };
}

export interface WorkspaceState {
  desk: Product; // Represents the active table
  chair: Product; // Represents the active chair
  accessories: string[]; // List of selected accessory/monitor/stand/laptop/sidetable IDs
  zones: string[]; // List of selected extras/zones (unused, legacy support)
  durationWeeks: number; // 1, 2, 4, 12
  roomScene: 'middle' | 'corner' | 'window';
  wallColor: string;
  renderMode: 'photo' | 'model';
  customBgUrl?: string;
}

export const DESKS: Product[] = [
  {
    id: 'table-black',
    name: 'Black Adjustable Table',
    category: 'table',
    price: 12,
    description: 'Minimalist powder-coated height adjustable black table.',
    details: [
      'Indonesian timber core with matte black laminate',
      'Solid height steel frame support structure',
      'Supports manual adjustments and layouts'
    ],
    image: '/table/tableblack.png',
    visualInfo: {
      width: 300,
      height: 160,
      defaultX: 0,
      defaultY: 0,
      zIndex: 10
    }
  }
];

export const CHAIRS: Product[] = [
  {
    id: 'chair-ergo',
    name: 'Ergonomic Office Chair',
    category: 'chair',
    price: 8,
    description: 'High-density backing lumbar-support mesh office chair.',
    details: [
      'Breathable contouring mesh backrest',
      'Height adjustable pneumatic lift support',
      'Charcoal grey composite structural frame'
    ],
    image: '/chair/chair.png',
    visualInfo: {
      width: 110,
      height: 140,
      defaultX: 0,
      defaultY: 60,
      zIndex: 35
    }
  },
  {
    id: 'chair-leather',
    name: 'Premium Leather Chair',
    category: 'chair',
    price: 14,
    description: 'Luxury contoured soft leather executive villa chair.',
    details: [
      'High-back luxury support padding cushion',
      'Rich amber tan double-stitched leather casing',
      'Pneumatic seat adjustment and recline tension control'
    ],
    image: '/chair/chair2.png',
    visualInfo: {
      width: 115,
      height: 145,
      defaultX: 0,
      defaultY: 65,
      zIndex: 35
    }
  },
  {
    id: 'chair-back',
    name: 'Charcoal Mesh Chair (Rear)',
    category: 'chair',
    price: 7,
    description: 'Mesh office chair facing away for custom layouts.',
    details: [
      'Rear viewpoint mesh chair design',
      'Ideal for facing the window or wall presets'
    ],
    image: '/chair/chair-back.png',
    visualInfo: {
      width: 110,
      height: 140,
      defaultX: 0,
      defaultY: 55,
      zIndex: 35
    }
  }
];

export const ACCESSORIES: Product[] = [
  // Monitors
  {
    id: 'monitor-curved',
    name: '34" Curved Panorama Monitor',
    category: 'monitor',
    price: 19,
    description: 'Curved panoramic WQHD ultra-wide workstation monitor.',
    details: [
      '1500R curvature wrap-around immersive display',
      'Includes premium gas-arm table clamp'
    ],
    image: '/monitor/monitor-curved.png',
    visualInfo: {
      width: 160,
      height: 100,
      defaultX: 0,
      defaultY: -75,
      zIndex: 25
    }
  },
  {
    id: 'monitor-normal',
    name: '24" Office HD Monitor',
    category: 'monitor',
    price: 6,
    description: 'FHD Xiaomi Mi desktop monitor with thin bezels.',
    details: [
      'Full HD resolution with wide viewing angles',
      'Matte black desktop mount arm'
    ],
    image: '/monitor/normal-monitor.png',
    visualInfo: {
      width: 110,
      height: 85,
      defaultX: -30,
      defaultY: -65,
      zIndex: 25
    }
  },
  {
    id: 'monitor-sidestand',
    name: '27" Studio Display Monitor',
    category: 'monitor',
    price: 12,
    description: 'Sharp 4K UHD professional multitasking screen.',
    details: [
      'USB-C single cable laptop charging and display transmission',
      'Accurate factory-calibrated color values'
    ],
    image: '/monitor/side-stand-monitor.png',
    visualInfo: {
      width: 130,
      height: 95,
      defaultX: 30,
      defaultY: -70,
      zIndex: 25
    }
  },
  
  // Stands
  {
    id: 'stand-monitor',
    name: 'Dual Monitor Shelving Stand',
    category: 'stand',
    price: 4,
    description: 'Sturdy wooden riser stand providing cable organizers and desk shelves.',
    details: [
      'Oak-finish wooden structural tabletop riser',
      'Reduces neck strain by placing screens at eye-level'
    ],
    image: '/stand/monitor-stand.png',
    visualInfo: {
      width: 140,
      height: 45,
      defaultX: 0,
      defaultY: -35,
      zIndex: 15
    }
  },

  // Laptop
  {
    id: 'laptop-mac',
    name: 'MacBook Pro M3 Max',
    category: 'laptop',
    price: 20,
    description: 'Premium space black Apple silicon power laptop.',
    details: [
      'Apple M3 Max chip with 16-core CPU and 40-core GPU',
      'Liquid Retina XDR display with ProMotion technology'
    ],
    image: '/laptop/laptopmac.png',
    visualInfo: {
      width: 90,
      height: 65,
      defaultX: -45,
      defaultY: -25,
      zIndex: 22
    }
  },
  {
    id: 'laptop-win',
    name: 'Windows Custom Laptop',
    category: 'laptop',
    price: 15,
    description: 'High-performance Windows developer notebook.',
    details: [
      'Intel Core i9 processor with GeForce RTX graphics',
      'High-refresh rate anti-glare developer display'
    ],
    image: '/laptop/lap2.png',
    visualInfo: {
      width: 90,
      height: 65,
      defaultX: 45,
      defaultY: -25,
      zIndex: 22
    }
  },

  // Sidetable
  {
    id: 'sidetable-teak',
    name: 'Teak Wood Side Table',
    category: 'sidetable',
    price: 5,
    description: 'Authentic local hand-crafted teak wooden side desk.',
    details: [
      'Solid Indonesian teak construction',
      'Adds convenient side storage for drinks and notebooks'
    ],
    image: '/sideTable/sideTable1.png',
    visualInfo: {
      width: 95,
      height: 90,
      defaultX: -120,
      defaultY: 60,
      zIndex: 8
    }
  },
  {
    id: 'sidetable-metal',
    name: 'Contemporary Metal Side Table',
    category: 'sidetable',
    price: 4,
    description: 'Industrial metal frame round side accent table.',
    details: [
      'Rust-proof powder coated iron finish',
      'Lightweight modular villa furnishing accent'
    ],
    image: '/sideTable/sidetable2.png',
    visualInfo: {
      width: 90,
      height: 85,
      defaultX: 120,
      defaultY: 60,
      zIndex: 8
    }
  },

  // General Accessories
  {
    id: 'acc-purifier-smart',
    name: 'Smart HEPA Air Purifier',
    category: 'accessories',
    price: 5,
    description: 'Filtra tech clean air purifier to capture tropical allergens.',
    details: [
      'True HEPA particulate filter removing 99.9% dust',
      'Whisper silent night mode setting'
    ],
    image: '/accessories/airPurifier.png',
    visualInfo: {
      width: 60,
      height: 90,
      defaultX: 110,
      defaultY: -20,
      zIndex: 22
    }
  },
  {
    id: 'acc-coffee-espresso',
    name: 'Bali Villa Espresso Machine',
    category: 'accessories',
    price: 18,
    description: 'High-pressure Italian steam pump espresso maker.',
    details: [
      '15-bar professional steam extraction pump',
      'Delivered with 1kg Canggu roast Kintamani beans'
    ],
    image: '/accessories/coffemachine.png',
    visualInfo: {
      width: 75,
      height: 90,
      defaultX: -110,
      defaultY: -20,
      zIndex: 22
    }
  },
  {
    id: 'acc-hub-mav',
    name: 'Mav Media Control Deck',
    category: 'accessories',
    price: 9,
    description: 'Ergonomic controller hub mapping macros and system volumes.',
    details: [
      'Multi-dial volume mixer and shortcuts dock',
      'Premium dark matte metal casing details'
    ],
    image: '/accessories/mav.png',
    visualInfo: {
      width: 65,
      height: 50,
      defaultX: 55,
      defaultY: -25,
      zIndex: 22
    }
  },
  {
    id: 'acc-purifier-dehumidifier',
    name: 'Tropical Humidifier Purifier',
    category: 'accessories',
    price: 6,
    description: 'Active room moisture control and air filter system.',
    details: [
      'Extracts tropical humidity to maintain dry comfort',
      'Auto-shutoff smart water tank'
    ],
    image: '/accessories/purifier.png',
    visualInfo: {
      width: 60,
      height: 90,
      defaultX: -130,
      defaultY: 20,
      zIndex: 22
    }
  },
  {
    id: 'acc-whiteboard',
    name: 'Villa Whiteboard',
    category: 'accessories',
    price: 5,
    description: 'Compact rolling write & erase brainstorming board.',
    details: [
      'Smooth dry-erase magnetic panel surface',
      'Sturdy steel wheel stand frame locks'
    ],
    image: '/accessories/whiteboard.png',
    visualInfo: {
      width: 90,
      height: 120,
      defaultX: -160,
      defaultY: -10,
      zIndex: 14
    }
  },
  {
    id: 'acc-mic',
    name: 'Studio Podcast Microphone',
    category: 'accessories',
    price: 6,
    description: 'Professional USB condenser vocal recording mic.',
    details: [
      'Cardioid directional capture pattern details',
      'Includes premium metal desk base mount support'
    ],
    image: '/accessories/mic.png',
    visualInfo: {
      width: 50,
      height: 75,
      defaultX: 30,
      defaultY: -35,
      zIndex: 24
    }
  },
  {
    id: 'acc-ps5',
    name: 'PlayStation 5 Console',
    category: 'accessories',
    price: 12,
    description: 'Next-gen gaming console with DualSense controller.',
    details: [
      'Play ultra high speed 4K HDR gaming',
      'Supplied with pre-installed nomad gaming accounts'
    ],
    image: '/accessories/ps5.png',
    visualInfo: {
      width: 65,
      height: 90,
      defaultX: 85,
      defaultY: -50,
      zIndex: 20
    }
  },
  {
    id: 'acc-exercisebike',
    name: 'Nomad Exercise Bike',
    category: 'accessories',
    price: 14,
    description: 'Villa cardio static fitness training exercise bike.',
    details: [
      'Magnetic resistance with smooth silent belt system',
      'LCD telemetry visual screen metrics'
    ],
    image: '/accessories/exercisebike.png',
    visualInfo: {
      width: 80,
      height: 110,
      defaultX: 180,
      defaultY: 45,
      zIndex: 7
    }
  }
];

export const ZONES: Product[] = []; // No active zones needed in new folder layout

export const ALL_PRODUCTS = [...DESKS, ...CHAIRS, ...ACCESSORIES];

export const getProductById = (id: string): Product | undefined => {
  return ALL_PRODUCTS.find(p => p.id === id);
};

export const calculateRentDetails = (state: WorkspaceState) => {
  const deskPrice = state.desk.price;
  const chairPrice = state.chair.price;
  const accPrice = state.accessories.reduce((sum, accId) => {
    const acc = getProductById(accId);
    return sum + (acc ? acc.price : 0);
  }, 0);
  const zonePrice = state.zones.reduce((sum, zoneId) => {
    const zone = getProductById(zoneId);
    return sum + (zone ? zone.price : 0);
  }, 0);

  const weeklyRate = deskPrice + chairPrice + accPrice + zonePrice;
  
  // Calculate discounts based on duration
  let discountPercent = 0;
  if (state.durationWeeks >= 12) {
    discountPercent = 20; // 20% off for 3+ months
  } else if (state.durationWeeks >= 4) {
    discountPercent = 10; // 10% off for 1+ months
  }

  const baseTotal = weeklyRate * state.durationWeeks;
  const discountAmount = Math.round((baseTotal * discountPercent) / 100);
  const finalTotal = baseTotal - discountAmount;

  return {
    weeklyRate,
    baseTotal,
    discountPercent,
    discountAmount,
    finalTotal
  };
};
