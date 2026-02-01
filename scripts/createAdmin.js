const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const passwordPlain = 'Admin@123'; // غيّرها لاحقًا
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const admin = await prisma.users.create({
      data: {
        phone: '0599000000',
        username: 'admin',
        password: hashedPassword,
        full_name: 'System Administrator',
        role: 'admin',
        is_active: true,
      },
    });

    console.log('✅ Admin user created successfully');
    console.log({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Admin user already exists');
    } else {
      console.error('❌ Error creating admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
