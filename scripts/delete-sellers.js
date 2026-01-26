require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  });
