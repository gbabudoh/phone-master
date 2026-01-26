require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding seller accounts...\n');

  const password = await bcrypt.hash('seller123', 10);

  // Create Wholesale Seller
  const wholesaleSeller = await prisma.user.upsert({
    where: { email: 'wholesale@phone-master.co.uk' },
    update: {},
    create: {
      email: 'wholesale@phone-master.co.uk',
      password,
      role: 'wholesale_seller',
      status: 'active',
      profile: {
        create: {
          firstName: 'Wholesale',
          lastName: 'Trader',
        }
      },
      sellerDetails: {
        create: {
          plan: 'wholesale_sub',
          companyName: 'Wholesale Phone Traders Ltd',
        }
      }
    }
  });
  console.log('✅ Wholesale Seller created:', wholesaleSeller.email);

  // Create Retail Seller
  const retailSeller = await prisma.user.upsert({
    where: { email: 'retail@phone-master.co.uk' },
    update: {},
    create: {
      email: 'retail@phone-master.co.uk',
      password,
      role: 'retail_seller',
      status: 'active',
      profile: {
        create: {
          firstName: 'Retail',
          lastName: 'Store',
        }
      },
      sellerDetails: {
        create: {
          plan: 'retail_sub',
          companyName: 'Amaebi Store',
        }
      }
    }
  });
  console.log('✅ Retail Seller created:', retailSeller.email);

  // Create Personal Seller
  const personalSeller = await prisma.user.upsert({
    where: { email: 'personal@phone-master.co.uk' },
    update: {},
    create: {
      email: 'personal@phone-master.co.uk',
      password,
      role: 'personal_seller',
      status: 'active',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
        }
      },
      sellerDetails: {
        create: {
          plan: 'free',
        }
      }
    }
  });
  console.log('✅ Personal Seller created:', personalSeller.email);

  // Create a pending seller
  const pendingSeller = await prisma.user.upsert({
    where: { email: 'pending@phone-master.co.uk' },
    update: {},
    create: {
      email: 'pending@phone-master.co.uk',
      password,
      role: 'retail_seller',
      status: 'pending_verification',
      profile: {
        create: {
          firstName: 'Pending',
          lastName: 'Seller',
        }
      },
      sellerDetails: {
        create: {
          plan: 'retail_sub',
          companyName: 'New Phone Shop',
        }
      }
    }
  });
  console.log('✅ Pending Seller created:', pendingSeller.email);

  console.log('\n📋 Seller Accounts:');
  console.log('─────────────────────────────────────────');
  console.log('Wholesale: wholesale@phone-master.co.uk / seller123');
  console.log('Retail:    retail@phone-master.co.uk / seller123');
  console.log('Personal:  personal@phone-master.co.uk / seller123');
  console.log('Pending:   pending@phone-master.co.uk / seller123');
  console.log('─────────────────────────────────────────');
  console.log('\n✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
