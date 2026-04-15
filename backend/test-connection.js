const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to database!');
    console.log('');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database query successful!');
    console.log('PostgreSQL version:', result[0].version);
    console.log('');
    console.log('🎉 Connection test passed! You can now run migrations.');
    
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('');
    console.log('Error:', error.message);
    console.log('');
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 Possible solutions:');
      console.log('1. Check your password is correct');
      console.log('2. URL-encode special characters in password:');
      console.log('   @ becomes %40');
      console.log('   # becomes %23');
      console.log('   $ becomes %24');
      console.log('');
      console.log('3. Or reset your Supabase password to something simple (only letters and numbers)');
    } else if (error.message.includes('Tenant or user not found')) {
      console.log('💡 Possible solutions:');
      console.log('1. Make sure you\'re using the DIRECT connection (port 5432)');
      console.log('2. Host should be: db.nwqktzqgmssgorrghfmd.supabase.co');
      console.log('3. NOT: aws-0-us-east-1.pooler.supabase.com');
    } else {
      console.log('💡 Check GET_CONNECTION_STRING.md for help');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
