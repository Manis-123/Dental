import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import Treatment from './models/Treatment.js';
import Appointment from './models/Appointment.js';
import Bill from './models/Bill.js';

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Patient.deleteMany(),
    Doctor.deleteMany(),
    Treatment.deleteMany(),
    Appointment.deleteMany(),
    Bill.deleteMany(),
  ]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@dental.com',
    password: 'admin123',
    role: 'admin',
  });

  const staff = await User.create({
    name: 'Reception Staff',
    email: 'staff@dental.com',
    password: 'staff123',
    role: 'staff',
  });

  const doctors = await Doctor.insertMany([
    { name: 'Dr. Ahmed Khan', specialization: 'Orthodontics', phone: '0300-1111111', experience: 12 },
    { name: 'Dr. Sara Ali', specialization: 'Endodontics', phone: '0300-2222222', experience: 8 },
    { name: 'Dr. Hassan Raza', specialization: 'General Dentistry', phone: '0300-3333333', experience: 15 },
  ]);

  const treatments = await Treatment.insertMany([
    { name: 'Teeth Cleaning', description: 'Professional dental cleaning', price: 2500, duration: 45, category: 'cleaning' },
    { name: 'Tooth Filling', description: 'Composite filling', price: 4000, duration: 60, category: 'filling' },
    { name: 'Root Canal', description: 'Root canal therapy', price: 15000, duration: 90, category: 'root_canal' },
    { name: 'Teeth Whitening', description: 'Laser whitening session', price: 12000, duration: 60, category: 'whitening' },
    { name: 'Tooth Extraction', description: 'Simple extraction', price: 3500, duration: 30, category: 'extraction' },
  ]);

  const patients = await Patient.insertMany([
    { name: 'Ali Hassan', email: 'ali@email.com', phone: '0311-1111111', age: 28, gender: 'male' },
    { name: 'Fatima Noor', email: 'fatima@email.com', phone: '0311-2222222', age: 34, gender: 'female' },
    { name: 'Usman Malik', email: 'usman@email.com', phone: '0311-3333333', age: 22, gender: 'male' },
  ]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await Appointment.insertMany([
    {
      patient: patients[0]._id,
      doctor: doctors[2]._id,
      treatment: treatments[0]._id,
      date: tomorrow,
      time: '10:00 AM',
      status: 'scheduled',
    },
    {
      patient: patients[1]._id,
      doctor: doctors[1]._id,
      treatment: treatments[2]._id,
      date: tomorrow,
      time: '11:30 AM',
      status: 'scheduled',
    },
  ]);

  await Bill.insertMany([
    {
      billNumber: 'BILL-20260521-0001',
      patient: patients[0]._id,
      items: [
        { treatment: treatments[0]._id, name: 'Teeth Cleaning', quantity: 1, unitPrice: 2500, amount: 2500 },
      ],
      subtotal: 2500,
      discount: 0,
      total: 2500,
      paidAmount: 2500,
      status: 'paid',
      paymentMethod: 'cash',
      createdBy: admin._id,
    },
    {
      billNumber: 'BILL-20260521-0002',
      patient: patients[1]._id,
      items: [
        { treatment: treatments[2]._id, name: 'Root Canal', quantity: 1, unitPrice: 15000, amount: 15000 },
        { name: 'X-Ray', quantity: 1, unitPrice: 1500, amount: 1500 },
      ],
      subtotal: 16500,
      discount: 500,
      total: 16000,
      paidAmount: 8000,
      status: 'partial',
      paymentMethod: 'card',
      notes: 'Second installment due next visit',
      createdBy: staff._id,
    },
    {
      billNumber: 'BILL-20260521-0003',
      patient: patients[2]._id,
      items: [
        { treatment: treatments[1]._id, name: 'Tooth Filling', quantity: 2, unitPrice: 4000, amount: 8000 },
      ],
      subtotal: 8000,
      discount: 0,
      total: 8000,
      paidAmount: 0,
      status: 'pending',
      createdBy: admin._id,
    },
  ]);

  console.log('Sample data seeded successfully');
  console.log('Login: admin@dental.com / admin123');
  console.log('Login: staff@dental.com / staff123');
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
