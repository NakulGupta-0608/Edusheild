import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const InstituteSchema = new mongoose.Schema({
  instituteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  ownerDetails: {
    name: { type: String },
    contact: { type: String },
    email: { type: String }
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  capacity: {
    maxAllowed: { type: Number, default: 0 },
    currentlyEnrolled: { type: Number, default: 0 }
  },
  riskStatus: {
    type: String,
    enum: ['SAFE', 'WARNING', 'UNSAFE', 'PENDING_REGISTRATION'],
    default: 'PENDING_REGISTRATION'
  },
  registrationDate: { type: Date, default: Date.now }
});

const Institute = mongoose.models.Institute || mongoose.model('Institute', InstituteSchema);

const seedInstitutes = [
  {
    instituteId: 'INST001',
    name: 'Allen Career Institute',
    password: 'password123',
    address: { city: 'Kota', state: 'Rajasthan' },
    riskStatus: 'SAFE',
    capacity: { maxAllowed: 5000, currentlyEnrolled: 4500 }
  },
  {
    instituteId: 'INST002',
    name: 'Resonance',
    password: 'password123',
    address: { city: 'Kota', state: 'Rajasthan' },
    riskStatus: 'WARNING',
    capacity: { maxAllowed: 3000, currentlyEnrolled: 2900 },
  },
  {
    instituteId: 'INST003',
    name: 'Aakash Institute',
    password: 'password123',
    address: { city: 'Delhi', state: 'Delhi' },
    riskStatus: 'UNSAFE',
    capacity: { maxAllowed: 1000, currentlyEnrolled: 1000 }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Institute.deleteMany({});
    console.log('Cleared existing institutes');

    // Insert mock data
    await Institute.insertMany(seedInstitutes);
    console.log('Successfully seeded institutes');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
