import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';

const createAdmin = async () => {
  await connectDB();
  const email = 'admin@dental.com';
  const exists = await User.findOne({ email });
  if (exists) {
    if (exists.role !== 'admin') {
      exists.role = 'admin';
      await exists.save();
      console.log('User upgraded to admin:', email);
    } else {
      console.log('Admin already exists:', email);
    }
  } else {
    await User.create({
      name: 'Admin',
      email,
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created:', email, '/ admin123');
  }
  await mongoose.connection.close();
};

createAdmin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
