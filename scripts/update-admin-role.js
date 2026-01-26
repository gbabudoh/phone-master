const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateAdminRole() {
  try {
    console.log('🔄 Updating admin role...');

    const admin = await prisma.user.update({
      where: { email: 'admin1@phone-master.co.uk' },
      data: { role: 'admin' },
      include: { profile: true },
    });

    console.log('✅ Admin role updated successfully!');
    console.log('');
    console.log('📧 Email:', admin.email);
    console.log('👤 Role:', admin.role);
    console.log('');
    console.log('🔗 Login at: http://localhost:3000/admin/login');
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

updateAdminRole()
  .then(() => {
    console.log('✅ Update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  });
