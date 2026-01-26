import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin1@phone-master.co.uk' },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin1@phone-master.co.uk',
        password: hashedPassword,
        role: 'wholesale_seller',
        status: 'active',
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            phone: '+44 20 1234 5678',
            address: {
              street: '123 Admin Street',
              city: 'London',
              state: 'England',
              postalCode: 'SW1A 1AA',
              country: 'United Kingdom',
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);
    console.log('');
    console.log('🔗 Login at: http://localhost:3000/admin/login');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedAdmin()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
