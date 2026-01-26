import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Load env from .env.local
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🗑️  Deleting all sellers...\n');

  // Delete all sellers (personal, retail, wholesale)
  const result = await prisma.user.deleteMany({
    where: {
      role: {
        in: ['personal_seller', 'retail_seller', 'wholesale_seller'],
      },
    },
  });

  console.log(`✅ Deleted ${result.count} seller accounts`);
  console.log('\n✅ Done! You can now register new sellers.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
