const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });

    if (existingUser) {
      console.log('Test user already exists');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });

    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
