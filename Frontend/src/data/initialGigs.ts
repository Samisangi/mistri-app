// Initial Gigs Data - Pre-populated services from verified Mistris
import ahmedNawaz from '@/assets/ahmed.jpeg';
import basit from '@/assets/basit.jpeg';
import sajjadHussain from '@/assets/sajjad.jpeg';
import yasirAhmed from '@/assets/yasir.jpeg';
import mistri1 from '@/assets/asif.jpeg';
import mistri2 from '@/assets/ali.jpeg';
import mistri3 from '@/assets/usman.jpeg';
import mistri4 from '@/assets/imran.jpeg';
import mistri5 from '@/assets/khalid.jpeg';
import mistri6 from '@/assets/hamza.jpeg';
import mistri7 from '@/assets/bilal.jpeg';
import mistri8 from '@/assets/faisal.jpeg';
import mistri9 from '@/assets/rashid.jpeg';
import mistri10 from '@/assets/shahid.jpeg';
import mistri11 from '@/assets/zubair.jpeg';
import mistri12 from '@/assets/naeem.jpeg';
import mistri13 from '@/assets/tariq.jpeg';
import mistri14 from '@/assets/shoaib.jpeg';
import mistri15 from '@/assets/kamran.jpeg';
import mistri16 from '@/assets/wasim.jpeg';

export const initialGigs = [
  {
    id: 'gig_1',
    mistriId: 'mistri_ahmed_nawaz',
    mistriName: 'Ahmed Nawaz',
    title: 'Professional Plumbing Services - Water Line & Drainage Expert',
    category: 'Plumbing',
    description: 'Experienced plumber with 8+ years in residential and commercial plumbing. Specializing in pipe installation, leak repairs, bathroom fittings, and drainage solutions. Available for emergency calls 24/7.',
    images: [ahmedNawaz],
    packages: {
      basic: {
        price: 800,
        deliveryDays: 1,
        description: 'Basic plumbing repair (leak fix, tap replacement, minor drain cleaning)'
      },
      standard: {
        price: 1500,
        deliveryDays: 2,
        description: 'Standard plumbing work (bathroom fittings, water line installation, tank repair)'
      },
      premium: {
        price: 3000,
        deliveryDays: 3,
        description: 'Complete plumbing solution (full bathroom setup, drainage system, water supply lines)'
      }
    },
    rating: 4.8,
    reviews: 42,
    orders: 156,
    active: true,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'gig_2',
    mistriId: 'mistri_basit',
    mistriName: 'Basit Ali',
    title: 'Expert Electrician - Wiring, Installation & Repair Services',
    category: 'Electrician',
    description: 'Certified electrician with 10+ years of experience. Expert in house wiring, electrical panel installation, appliance repairs, and energy-efficient solutions. Licensed and insured.',
    images: [basit],
    packages: {
      basic: {
        price: 600,
        deliveryDays: 1,
        description: 'Basic electrical work (switch/socket replacement, bulb fitting, minor repairs)'
      },
      standard: {
        price: 1800,
        deliveryDays: 2,
        description: 'Standard electrical services (fan installation, wiring extension, circuit breaker work)'
      },
      premium: {
        price: 4000,
        deliveryDays: 4,
        description: 'Complete electrical setup (full house wiring, panel installation, distribution board)'
      }
    },
    rating: 4.9,
    reviews: 68,
    orders: 203,
    active: true,
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 'gig_3',
    mistriId: 'mistri_sajjad',
    mistriName: 'Sajjad Hussain',
    title: 'Professional Painting Services - Interior & Exterior Expert',
    category: 'Painting',
    description: 'Skilled painter with 7+ years experience in residential and commercial painting. Expert in interior design, texture work, waterproofing, and color consultation. Premium quality guaranteed.',
    images: [sajjadHussain],
    packages: {
      basic: {
        price: 400,
        deliveryDays: 1,
        description: 'Basic painting (single room, 10x10 ft, 2 coats, standard colors)'
      },
      standard: {
        price: 1200,
        deliveryDays: 3,
        description: 'Standard painting (2-3 rooms, texture work, premium colors, ceiling included)'
      },
      premium: {
        price: 3500,
        deliveryDays: 7,
        description: 'Premium painting package (full house interior/exterior, texture, waterproofing, design)'
      }
    },
    rating: 4.7,
    reviews: 51,
    orders: 138,
    active: true,
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 'gig_4',
    mistriId: 'mistri_yasir',
    mistriName: 'Yasir Ahmed',
    title: 'Master Carpenter - Furniture Making & Wood Work Services',
    category: 'Furniture',
    description: 'Expert carpenter with 12+ years in custom furniture making, wood work, and repairs. Specializing in wardrobes, kitchen cabinets, doors, and decorative wooden items. Quality craftsmanship.',
    images: [yasirAhmed],
    packages: {
      basic: {
        price: 1000,
        deliveryDays: 2,
        description: 'Basic carpentry (furniture repair, door adjustment, shelf installation)'
      },
      standard: {
        price: 3000,
        deliveryDays: 5,
        description: 'Standard carpentry (custom shelves, small cabinet, furniture assembly)'
      },
      premium: {
        price: 8000,
        deliveryDays: 10,
        description: 'Premium carpentry (custom wardrobe, kitchen cabinets, complete wood work project)'
      }
    },
    rating: 4.9,
    reviews: 45,
    orders: 121,
    active: true,
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 'gig_5',
    mistriId: 'mistri_5',
    mistriName: 'Muhammad Asif',
    title: 'Residential Plumbing Expert - Fast & Reliable Service',
    category: 'Plumbing',
    description: '5+ years of plumbing experience. Quick response for emergency repairs. Expert in modern plumbing fixtures, water heater installation, and maintenance work.',
    images: [mistri1],
    packages: {
      basic: {
        price: 700,
        deliveryDays: 1,
        description: 'Emergency plumbing fix (urgent leak repair, blocked drain, tap replacement)'
      },
      standard: {
        price: 1400,
        deliveryDays: 2,
        description: 'Standard plumbing services (shower installation, water heater setup, pipe repair)'
      },
      premium: {
        price: 2800,
        deliveryDays: 3,
        description: 'Complete bathroom renovation (fixtures, piping, water supply system)'
      }
    },
    rating: 4.6,
    reviews: 34,
    orders: 89,
    active: true,
    createdAt: new Date('2024-03-01').toISOString()
  },
  {
    id: 'gig_6',
    mistriId: 'mistri_6',
    mistriName: 'Ali Raza',
    title: 'Certified Electrician - Solar & Home Automation Specialist',
    category: 'Electrician',
    description: 'Modern electrician specializing in smart home solutions and solar panel installation. 6+ years experience with residential and commercial electrical systems.',
    images: [mistri2],
    packages: {
      basic: {
        price: 700,
        deliveryDays: 1,
        description: 'Basic electrical repairs (outlet installation, light fixture, switch repair)'
      },
      standard: {
        price: 2000,
        deliveryDays: 3,
        description: 'Standard electrical work (AC wiring, circuit installation, voltage stabilizer)'
      },
      premium: {
        price: 5000,
        deliveryDays: 5,
        description: 'Advanced electrical solutions (solar panel setup, home automation, complete wiring)'
      }
    },
    rating: 4.8,
    reviews: 39,
    orders: 95,
    active: true,
    createdAt: new Date('2024-03-10').toISOString()
  },
  {
    id: 'gig_7',
    mistriId: 'mistri_7',
    mistriName: 'Naveed Khan',
    title: 'Interior & Exterior Painting - Color Expert',
    category: 'Painting',
    description: 'Creative painter with eye for color combinations. 8+ years experience in interior design painting, wall art, and decorative finishes. Premium quality paints used.',
    images: [mistri3],
    packages: {
      basic: {
        price: 500,
        deliveryDays: 1,
        description: 'Basic room painting (small room 8x10 ft, 2 coats, labor only)'
      },
      standard: {
        price: 1500,
        deliveryDays: 4,
        description: 'Standard painting package (living room, bedroom, putty, primer, 2 coats)'
      },
      premium: {
        price: 4000,
        deliveryDays: 8,
        description: 'Premium interior design (full house painting, texture, design patterns, waterproofing)'
      }
    },
    rating: 4.7,
    reviews: 48,
    orders: 112,
    active: true,
    createdAt: new Date('2024-03-15').toISOString()
  },
  {
    id: 'gig_8',
    mistriId: 'mistri_8',
    mistriName: 'Imran Siddiqui',
    title: 'Custom Furniture & Wood Work Expert',
    category: 'Furniture',
    description: 'Specialized in custom-made furniture and modular kitchen designs. 9+ years crafting quality wooden products. Expert in modern and traditional styles.',
    images: [mistri4],
    packages: {
      basic: {
        price: 1200,
        deliveryDays: 3,
        description: 'Basic wood work (furniture repair, polish, minor modifications)'
      },
      standard: {
        price: 3500,
        deliveryDays: 7,
        description: 'Standard carpentry (custom shelving unit, TV stand, study table)'
      },
      premium: {
        price: 9000,
        deliveryDays: 12,
        description: 'Premium custom furniture (modular kitchen, bedroom set, built-in wardrobes)'
      }
    },
    rating: 4.8,
    reviews: 37,
    orders: 78,
    active: true,
    createdAt: new Date('2024-03-20').toISOString()
  },
  {
    id: 'gig_9',
    mistriId: 'mistri_9',
    mistriName: 'Rashid Mahmood',
    title: 'Commercial Plumbing Services - Large Projects Expert',
    category: 'Plumbing',
    description: 'Experienced in both residential and commercial plumbing projects. Team leader with 11+ years experience handling large-scale installations and repairs.',
    images: [mistri5],
    packages: {
      basic: {
        price: 900,
        deliveryDays: 1,
        description: 'Commercial plumbing repair (fixture replacement, minor leak fix, maintenance)'
      },
      standard: {
        price: 2000,
        deliveryDays: 3,
        description: 'Standard commercial work (restroom setup, water line installation, drainage)'
      },
      premium: {
        price: 5000,
        deliveryDays: 5,
        description: 'Large commercial project (complete plumbing system, multiple bathrooms, water supply)'
      }
    },
    rating: 4.9,
    reviews: 56,
    orders: 167,
    active: true,
    createdAt: new Date('2024-04-01').toISOString()
  },
  {
    id: 'gig_10',
    mistriId: 'mistri_10',
    mistriName: 'Zahid Hussain',
    title: 'Industrial Electrician - Heavy Equipment Specialist',
    category: 'Electrician',
    description: 'Industrial electrician with expertise in heavy machinery and commercial electrical systems. 13+ years experience with factories and commercial buildings.',
    images: [mistri6],
    packages: {
      basic: {
        price: 800,
        deliveryDays: 1,
        description: 'Industrial electrical repair (motor repair, control panel, basic troubleshooting)'
      },
      standard: {
        price: 2500,
        deliveryDays: 3,
        description: 'Standard industrial work (machine wiring, control systems, electrical panels)'
      },
      premium: {
        price: 6000,
        deliveryDays: 6,
        description: 'Complete industrial setup (factory wiring, heavy equipment installation, main panels)'
      }
    },
    rating: 4.9,
    reviews: 44,
    orders: 98,
    active: true,
    createdAt: new Date('2024-04-10').toISOString()
  },
  {
    id: 'gig_11',
    mistriId: 'mistri_11',
    mistriName: 'Farhan Ahmed',
    title: 'Texture & Waterproofing Painting Expert',
    category: 'Painting',
    description: 'Specialist in texture painting and waterproofing solutions. 6+ years experience in heat-proof coatings, damp treatment, and decorative textures.',
    images: [mistri7],
    packages: {
      basic: {
        price: 600,
        deliveryDays: 2,
        description: 'Basic waterproofing (small area damp treatment, 1 room ceiling waterproofing)'
      },
      standard: {
        price: 1800,
        deliveryDays: 4,
        description: 'Standard texture work (2-3 rooms texture painting, heat-proof exterior)'
      },
      premium: {
        price: 4500,
        deliveryDays: 8,
        description: 'Premium waterproofing package (complete roof treatment, exterior waterproofing, texture)'
      }
    },
    rating: 4.7,
    reviews: 41,
    orders: 103,
    active: true,
    createdAt: new Date('2024-04-15').toISOString()
  },
  {
    id: 'gig_12',
    mistriId: 'mistri_12',
    mistriName: 'Kamran Ali',
    title: 'Door & Window Installation - Wood Work Specialist',
    category: 'Furniture',
    description: 'Expert in door and window installations, repairs, and custom wooden work. 8+ years experience with quality craftsmanship and attention to detail.',
    images: [mistri8],
    packages: {
      basic: {
        price: 800,
        deliveryDays: 1,
        description: 'Basic door/window work (adjustment, lock installation, minor repairs)'
      },
      standard: {
        price: 2500,
        deliveryDays: 4,
        description: 'Standard installation (new door/window installation, frame work, polish)'
      },
      premium: {
        price: 6000,
        deliveryDays: 8,
        description: 'Premium wood work (custom doors, decorative windows, complete carpentry project)'
      }
    },
    rating: 4.8,
    reviews: 33,
    orders: 87,
    active: true,
    createdAt: new Date('2024-04-20').toISOString()
  },
  // Additional Plumbing Workers
  {
    id: 'gig_13',
    mistriId: 'mistri_13',
    mistriName: 'Rizwan Ahmed',
    title: 'Emergency Plumbing Services - 24/7 Available',
    category: 'Plumbing',
    description: 'Specialized in emergency plumbing repairs with 10+ years experience. Expert in gas line installations, sewage systems, and modern plumbing solutions.',
    images: [mistri9],
    packages: {
      basic: {
        price: 900,
        deliveryDays: 1,
        description: 'Emergency repair (urgent leak fix, pipe burst repair, drain unclogging)'
      },
      standard: {
        price: 2000,
        deliveryDays: 2,
        description: 'Gas line work (gas pipe installation, gas leak repair, safety inspection)'
      },
      premium: {
        price: 4500,
        deliveryDays: 4,
        description: 'Complete sewage solution (sewage line installation, septic tank work, drainage overhaul)'
      }
    },
    rating: 4.9,
    reviews: 58,
    orders: 203,
    active: true,
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 'gig_14',
    mistriId: 'mistri_14',
    mistriName: 'Tariq Mehmood',
    title: 'Bathroom & Kitchen Plumbing Expert',
    category: 'Plumbing',
    description: 'Specialized in modern bathroom and kitchen plumbing installations. Expert in fixture installations, water heater setup, and renovation projects.',
    images: [mistri10],
    packages: {
      basic: {
        price: 700,
        deliveryDays: 1,
        description: 'Fixture replacement (tap, shower head, sink faucet installation)'
      },
      standard: {
        price: 1800,
        deliveryDays: 3,
        description: 'Kitchen plumbing (sink installation, dishwasher connection, water filtration)'
      },
      premium: {
        price: 3800,
        deliveryDays: 5,
        description: 'Complete renovation (bathroom remodeling, kitchen upgrade, water heater installation)'
      }
    },
    rating: 4.7,
    reviews: 45,
    orders: 132,
    active: true,
    createdAt: new Date('2024-03-05').toISOString()
  },
  // Additional Electrician Workers
  {
    id: 'gig_15',
    mistriId: 'mistri_15',
    mistriName: 'Usman Ghani',
    title: 'Industrial Electrician - Heavy Machinery Expert',
    category: 'Electrician',
    description: '12+ years experience in industrial electrical work. Specialized in motor repairs, control panels, and heavy machinery electrical systems.',
    images: [mistri11],
    packages: {
      basic: {
        price: 1000,
        deliveryDays: 1,
        description: 'Motor repair (single phase motor, pump motor, basic troubleshooting)'
      },
      standard: {
        price: 2500,
        deliveryDays: 3,
        description: 'Control panel work (panel wiring, contactor replacement, timer installation)'
      },
      premium: {
        price: 5500,
        deliveryDays: 5,
        description: 'Industrial setup (machinery wiring, power distribution, complete electrical system)'
      }
    },
    rating: 4.8,
    reviews: 52,
    orders: 167,
    active: true,
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: 'gig_16',
    mistriId: 'mistri_16',
    mistriName: 'Asif Raza',
    title: 'Solar & Renewable Energy Electrician',
    category: 'Electrician',
    description: 'Specialist in solar panel installations and renewable energy systems. Modern approach to energy-efficient electrical solutions.',
    images: [mistri12],
    packages: {
      basic: {
        price: 1200,
        deliveryDays: 2,
        description: 'Solar consultation (site survey, energy audit, system recommendation)'
      },
      standard: {
        price: 3500,
        deliveryDays: 5,
        description: 'Solar installation (small system setup, inverter installation, basic panel mounting)'
      },
      premium: {
        price: 9000,
        deliveryDays: 10,
        description: 'Complete solar solution (full house solar system, net metering, backup battery)'
      }
    },
    rating: 4.9,
    reviews: 38,
    orders: 89,
    active: true,
    createdAt: new Date('2024-03-15').toISOString()
  },
  // Additional Painting Workers
  {
    id: 'gig_17',
    mistriId: 'mistri_17',
    mistriName: 'Rafiq Khan',
    title: 'Commercial Painting - Large Projects Specialist',
    category: 'Painting',
    description: 'Experienced in large-scale commercial painting projects. Expert in texture work, waterproofing, and industrial coatings.',
    images: [mistri13],
    packages: {
      basic: {
        price: 600,
        deliveryDays: 2,
        description: 'Room painting (single room, basic prep, 2 coats of paint)'
      },
      standard: {
        price: 2200,
        deliveryDays: 5,
        description: 'Commercial painting (office space, showroom, texture work, waterproofing)'
      },
      premium: {
        price: 7000,
        deliveryDays: 12,
        description: 'Large project (complete building, industrial coating, roof waterproofing, texture)'
      }
    },
    rating: 4.8,
    reviews: 61,
    orders: 178,
    active: true,
    createdAt: new Date('2024-02-25').toISOString()
  },
  {
    id: 'gig_18',
    mistriId: 'mistri_18',
    mistriName: 'Khalid Hussain',
    title: 'Decorative Painting & Wall Art Expert',
    category: 'Painting',
    description: 'Specialist in decorative painting techniques, wall art, and creative interior finishes. Transform your space with artistic touches.',
    images: [mistri14],
    packages: {
      basic: {
        price: 800,
        deliveryDays: 2,
        description: 'Accent wall (single feature wall, decorative techniques, special effects)'
      },
      standard: {
        price: 2800,
        deliveryDays: 5,
        description: 'Room makeover (complete room with decorative elements, stencil work, color consultation)'
      },
      premium: {
        price: 6500,
        deliveryDays: 10,
        description: 'Artistic project (wall murals, custom designs, 3D effects, complete artistic transformation)'
      }
    },
    rating: 4.9,
    reviews: 43,
    orders: 95,
    active: true,
    createdAt: new Date('2024-03-20').toISOString()
  },
  // Additional Furniture/Carpentry Workers
  {
    id: 'gig_19',
    mistriId: 'mistri_19',
    mistriName: 'Shakeel Ahmed',
    title: 'Modular Kitchen & Wardrobe Specialist',
    category: 'Furniture',
    description: 'Expert in modern modular furniture solutions. Specialized in custom kitchen cabinets, wardrobes, and storage solutions.',
    images: [mistri15],
    packages: {
      basic: {
        price: 1200,
        deliveryDays: 3,
        description: 'Small furniture (shoe rack, small cabinet, shelving unit)'
      },
      standard: {
        price: 3500,
        deliveryDays: 7,
        description: 'Modular wardrobe (standard size, basic design, installation included)'
      },
      premium: {
        price: 9000,
        deliveryDays: 15,
        description: 'Complete kitchen (modular kitchen cabinets, countertop, full installation, accessories)'
      }
    },
    rating: 4.8,
    reviews: 55,
    orders: 142,
    active: true,
    createdAt: new Date('2024-02-15').toISOString()
  },
  {
    id: 'gig_20',
    mistriId: 'mistri_20',
    mistriName: 'Nadeem Shah',
    title: 'Antique Furniture Restoration & Polish Expert',
    category: 'Furniture',
    description: 'Specialized in restoring and polishing antique and vintage furniture. Expert in wood refinishing and traditional carpentry techniques.',
    images: [mistri16],
    packages: {
      basic: {
        price: 400,
        deliveryDays: 2,
        description: 'Furniture polish (single piece, basic polish, minor touch-ups)'
      },
      standard: {
        price: 1200,
        deliveryDays: 4,
        description: 'Restoration work (antique repair, repolishing, structural fixes, refinishing)'
      },
      premium: {
        price: 2800,
        deliveryDays: 7,
        description: 'Complete restoration (full furniture set, detailed refinishing, antique techniques, protective coating)'
      }
    },
    rating: 4.9,
    reviews: 68,
    orders: 189,
    active: true,
    createdAt: new Date('2024-03-10').toISOString()
  }
];

// Version control for cache busting
const GIGS_DATA_VERSION = '3.0';

// Function to initialize gigs in localStorage
export const initializeGigs = () => {
  try {
    const currentVersion = localStorage.getItem('gigsDataVersion');
    
    // Force clear and reinitialize if version doesn't match
    if (currentVersion !== GIGS_DATA_VERSION) {
      console.log(`🔄 Version mismatch (${currentVersion} -> ${GIGS_DATA_VERSION}). Clearing old gigs data...`);
      localStorage.removeItem('gigs');
    }
    
    // Always reinitialize with updated images
    console.log(`🔄 Initializing gigs v${GIGS_DATA_VERSION} with updated images...`);
    localStorage.setItem('gigs', JSON.stringify(initialGigs));
    localStorage.setItem('gigsDataVersion', GIGS_DATA_VERSION);
    
    console.log(`✅ Successfully loaded ${initialGigs.length} gigs`);
    console.log('📸 Sample image path:', initialGigs[0]?.images[0]);
    
    // Verify storage
    const stored = JSON.parse(localStorage.getItem('gigs') || '[]');
    console.log(`✅ Verified: ${stored.length} gigs in localStorage`);
  } catch (error) {
    console.error('❌ Error initializing gigs:', error);
    // Try to set anyway
    try {
      localStorage.setItem('gigs', JSON.stringify(initialGigs));
      localStorage.setItem('gigsDataVersion', GIGS_DATA_VERSION);
      console.log('✅ Gigs set after error recovery');
    } catch (e) {
      console.error('❌ Failed to recover:', e);
    }
  }
};
