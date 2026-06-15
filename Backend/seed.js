const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Delete existing seed users
  await User.deleteMany({ 
    email: { $in: ['admin@gmail.com', 'mistri@gmail.com', 'client@gmail.com'] } 
  });

  await User.create([
    { name: 'Admin', email: 'admin@gmail.com', password: '1234', role: 'admin' },
    { name: 'Demo Mistri', email: 'mistri@gmail.com', password: '1234', role: 'mistri', phone: '03001234567' },
    { name: 'Demo Client', email: 'client@gmail.com', password: '1234', role: 'client', phone: '03009876543' },
  ]);

  console.log('✅ Demo users seeded');
  process.exit();
};

seed();