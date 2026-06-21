const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const unbanAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await User.updateOne(
    { email: 'admin@gmail.com' },
    { $set: { isActive: true } }
  );

  console.log('✅ Admin unbanned:', result);
  process.exit();
};

unbanAdmin();