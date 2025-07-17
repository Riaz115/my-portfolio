// Environment setup script
// Run this with: node setup-env.js

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment for registration system...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully');
} else {
  console.log('✅ .env.local file already exists');
}

// Check MongoDB connection
console.log('\n🔍 Checking MongoDB connection...');

const mongoose = require('mongoose');

async function testMongoConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    
    console.log('✅ Database operations working correctly');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running on your system');
    console.log('2. Check if MongoDB is accessible on port 27017');
    console.log('3. Try running: mongod --version');
    console.log('4. On Windows, try: net start MongoDB');
    console.log('5. On macOS/Linux, try: sudo systemctl start mongod');
  }
}

testMongoConnection();

console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Start the development server: npm run dev');
console.log('3. Test registration at: http://localhost:3000/auth/register');
console.log('4. Check browser console and server logs for any errors'); 