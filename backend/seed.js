const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('✨ Cleared existing users');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@tshirtstore.com',
      password: 'Admin@123',
      phone: '+91 9876543210',
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin user created:', adminUser.email);
    
    // Create test customer
    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'Password@123',
      phone: '+91 9876543211',
      role: 'customer',
      isActive: true
    });
    console.log('✅ Customer user created:', customerUser.email);
    
    // Create another test customer
    const testUser = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'Password@123',
      phone: '+91 9876543212',
      role: 'customer',
      isActive: true
    });
    console.log('✅ Test user created:', testUser.email);
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@tshirtstore.com / Admin@123');
    console.log('Customer: customer@example.com / Password@123');
    console.log('Test: jane@example.com / Password@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
