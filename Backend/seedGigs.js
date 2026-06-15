const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gig = require('./models/Gig');
const User = require('./models/User');

dotenv.config();

const seedGigs = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Get mistri user
  const mistri = await User.findOne({ role: 'mistri' });
  if (!mistri) {
    console.log('❌ No mistri user found. Run node seed.js first');
    process.exit();
  }

  await Gig.deleteMany({});

  await Gig.create([
    {
      mistriId: mistri._id,
      mistriName: mistri.name,
      title: 'Professional Plumbing Services - Water Line & Drainage Expert',
      category: 'Plumbing',
      description: 'Experienced plumber with 8+ years in residential and commercial plumbing.',
      images: [],
      packages: {
        basic: { price: 800, deliveryDays: 1, description: 'Basic plumbing repair' }
      },
      rating: 4.8, reviews: 42, orders: 156, active: true
    },
    {
      mistriId: mistri._id,
      mistriName: mistri.name,
      title: 'Expert Electrician - Wiring, Installation & Repair Services',
      category: 'Electrician',
      description: 'Certified electrician with 10+ years of experience.',
      images: [],
      packages: {
        basic: { price: 600, deliveryDays: 1, description: 'Basic electrical work' }
      },
      rating: 4.9, reviews: 68, orders: 203, active: true
    },
    {
      mistriId: mistri._id,
      mistriName: mistri.name,
      title: 'Professional Painting Services - Interior & Exterior Expert',
      category: 'Painting',
      description: 'Skilled painter with 7+ years experience.',
      images: [],
      packages: {
        basic: { price: 400, deliveryDays: 1, description: 'Basic painting' }
      },
      rating: 4.7, reviews: 51, orders: 138, active: true
    },
    {
      mistriId: mistri._id,
      mistriName: mistri.name,
      title: 'Master Carpenter - Furniture Making & Wood Work Services',
      category: 'Furniture',
      description: 'Expert carpenter with 12+ years in custom furniture making.',
      images: [],
      packages: {
        basic: { price: 1000, deliveryDays: 2, description: 'Basic carpentry' }
      },
      rating: 4.9, reviews: 45, orders: 121, active: true
    },
    {
      mistriId: mistri._id,
      mistriName: mistri.name,
      title: 'AC & Appliance Repair - All Brands Expert',
      category: 'AC & Appliance',
      description: 'Expert in AC servicing, repair, and all home appliances.',
      images: [],
      packages: {
        basic: { price: 1000, deliveryDays: 1, description: 'Basic appliance repair' }
      },
      rating: 4.6, reviews: 34, orders: 89, active: true
    },
    {
      mistriId: mistri._id,
      mistriName: mistri.name,
      title: 'General Home Maintenance & Repair Services',
      category: 'General',
      description: 'Complete home maintenance solutions for all your needs.',
      images: [],
      packages: {
        basic: { price: 600, deliveryDays: 1, description: 'Basic maintenance' }
      },
      rating: 4.7, reviews: 29, orders: 76, active: true
    },
  ]);

  console.log('✅ Gigs seeded successfully');
  process.exit();
};

seedGigs();