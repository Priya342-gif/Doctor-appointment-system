const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Doctor.deleteMany();
  await Appointment.deleteMany();

  // Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@docbook.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890',
    gender: 'male',
    age: 35,
  });

  // Patients
  const patient1 = await User.create({
    name: 'John Smith',
    email: 'john@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '9876543210',
    gender: 'male',
    age: 28,
    address: '123 Main St, New York',
  });

  const patient2 = await User.create({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'patient123',
    role: 'patient',
    phone: '9876543211',
    gender: 'female',
    age: 34,
    address: '456 Oak Ave, Los Angeles',
  });

  // Doctor users
  const doctorUsers = [
    { name: 'Dr. Emily Carter', email: 'emily@docbook.com', gender: 'female', age: 42 },
    { name: 'Dr. Michael Brown', email: 'michael@docbook.com', gender: 'male', age: 50 },
    { name: 'Dr. Lisa Wong', email: 'lisa@docbook.com', gender: 'female', age: 38 },
    { name: 'Dr. James Wilson', email: 'james@docbook.com', gender: 'male', age: 45 },
    { name: 'Dr. Maria Garcia', email: 'maria@docbook.com', gender: 'female', age: 40 },
    { name: 'Dr. Robert Lee', email: 'robert@docbook.com', gender: 'male', age: 55 },
  ];

  const createdDoctorUsers = [];
  for (const d of doctorUsers) {
    const u = await User.create({ ...d, password: 'doctor123', role: 'doctor', phone: '555000' + Math.floor(Math.random()*1000) });
    createdDoctorUsers.push(u);
  }

  const specializations = ['Cardiologist','Neurologist','Dermatologist','Orthopedic','Pediatrician','Psychiatrist'];
  const hospitals = ['City Medical Center','General Hospital','Health Plus Clinic','Metro Hospital','Care First Medical','Sunrise Health'];
  const days = [
    ['Monday','Wednesday','Friday'],
    ['Tuesday','Thursday','Saturday'],
    ['Monday','Tuesday','Wednesday','Thursday'],
    ['Wednesday','Thursday','Friday','Saturday'],
    ['Monday','Wednesday','Friday','Sunday'],
    ['Tuesday','Thursday','Saturday','Sunday'],
  ];
  const fees = [500, 800, 600, 700, 400, 900];
  const experiences = [12, 20, 8, 15, 5, 25];

  const createdDoctors = [];
  for (let i = 0; i < createdDoctorUsers.length; i++) {
    const doc = await Doctor.create({
      user: createdDoctorUsers[i]._id,
      specialization: specializations[i],
      qualification: 'MBBS, MD',
      experience: experiences[i],
      hospitalName: hospitals[i],
      consultationFee: fees[i],
      address: `${100+i} Medical Plaza, New York`,
      about: `Dr. ${createdDoctorUsers[i].name.split(' ').slice(1).join(' ')} is a highly experienced ${specializations[i]} with ${experiences[i]} years of practice.`,
      availableDays: days[i],
      availableTimeSlots: [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
      ],
    });
    createdDoctors.push(doc);
  }

  // Sample appointments
  await Appointment.create({
    patient: patient1._id,
    doctor: createdDoctors[0]._id,
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    appointmentTime: '10:00',
    status: 'accepted',
    notes: 'Regular checkup',
  });

  await Appointment.create({
    patient: patient2._id,
    doctor: createdDoctors[1]._id,
    appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    appointmentTime: '14:00',
    status: 'pending',
    notes: 'Headache and dizziness',
  });

  await Appointment.create({
    patient: patient1._id,
    doctor: createdDoctors[2]._id,
    appointmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    appointmentTime: '11:00',
    status: 'completed',
  });

  console.log('✅ Seed data inserted successfully!');
  console.log('Admin:   admin@docbook.com / admin123');
  console.log('Patient: john@example.com / patient123');
  console.log('Patient: sarah@example.com / patient123');
  console.log('Doctor:  emily@docbook.com / doctor123');
  process.exit();
};

seedData().catch((err) => { console.error(err); process.exit(1); });
