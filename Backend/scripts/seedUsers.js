const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');

const users = [
  {
    name: 'Sami Sangi',
    email: 'samisangi387@gmail.com',
    password: '123456',
    role: 'client',
    phone: '',
    isActive: true,
    isVerified: true,
  },
  {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin@123',
    role: 'admin',
    phone: '',
    isActive: true,
    isVerified: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  for (const userData of users) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const result = await User.findOneAndUpdate(
      { email: userData.email },
      {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        phone: userData.phone,
        isActive: userData.isActive,
        isVerified: userData.isVerified,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ User upserted: ${result.email} [role: ${result.role}]`);
  }

  console.log('\n🎉 All users seeded successfully!');
  console.log('   client  → samisangi387@gmail.com  / 123456');
  console.log('   admin   → admin@gmail.com          / admin@123');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
