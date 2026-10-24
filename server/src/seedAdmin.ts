import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/findit';
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!name || !email || !password || password.length < 12) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env.');
  }
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = name; existing.passwordHash = passwordHash; existing.role = 'ADMIN';
    await existing.save();
    console.log(`Updated administrator: ${email}`);
  } else {
    await User.create({ name, email, passwordHash, role: 'ADMIN' });
    console.log(`Created administrator: ${email}`);
  }
  await mongoose.disconnect();
}
main().catch((error) => { console.error(error.message || error); process.exit(1); });
