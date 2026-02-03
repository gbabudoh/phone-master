/* eslint-disable */
const { PrismaClient } = require('../lib/prisma-client')
require('dotenv').config({ path: '.env.local' })
const prisma = new PrismaClient()

async function main() {
  const pages = [
    {
      slug: 'terms',
      title: 'Terms of Service',
      content: `
       <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p class="text-gray-600 leading-relaxed">
            Welcome to Phone Master. By accessing our marketplace and using our services, you agree to be bound by these Terms of Service. 
            Please read them carefully before trading, buying, or selling on our platform.
          </p>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            To access certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          <ul class="list-disc ml-5 space-y-2 text-gray-600">
            <li>You must be at least 18 years old to use this service.</li>
            <li>Account information must be accurate and up-to-date.</li>
            <li>You are responsible for all activities under your account.</li>
          </ul>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Marketplace Rules</h2>
          <p class="text-gray-600 leading-relaxed">
            Phone Master acts as a facilitator for transactions between buyers and sellers. We strive to ensure the quality and authenticity of devices sold on our platform.
            Sellers must accurately describe their items, and buyers must make payments promptly.
          </p>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
          <p class="text-gray-600 leading-relaxed">
            Users are prohibited from selling stolen goods, counterfeit devices, or engaging in fraudulent activities. 
            Any violation will result in immediate account suspension and potential legal action.
          </p>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p class="text-gray-600 leading-relaxed">
            Phone Master is not liable for indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
          </p>
        </section>
      `,
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      content: `
         <p class="lead text-lg text-gray-600 mb-8">
            At Phone Master, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our marketplace website or use our mobile application.
          </p>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            We collect information that you strictly provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
          </p>
          <ul class="list-disc ml-5 space-y-2 text-gray-600">
             <li><strong>Personal Data:</strong> Name, email address, phone number, and shipping address.</li>
              <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card expiration date) needed to process payments.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address and browser type.</li>
          </ul>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
             Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
           <ul class="list-disc ml-5 space-y-2 text-gray-600">
              <li>Create and manage your account.</li>
              <li>Process your orders and payments.</li>
              <li>Email you regarding your account or order.</li>
              <li>Prevent fraudulent transactions.</li>
              <li>Assist law enforcement.</li>
              <li>Deliver targeted advertising.</li>
           </ul>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p class="text-gray-600 leading-relaxed">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>
      `,
    },
    {
      slug: 'contact',
      title: 'Contact Information',
      content: `
        <div class="space-y-6">
          <p class="text-gray-600">
             Have questions about the marketplace? Need support with an order? We're here to help.
          </p>
           
          <div>
            <h3 class="font-bold text-gray-900">Email</h3>
            <p class="text-gray-600">support@phonemaster.com</p>
             <p class="text-gray-600">sales@phonemaster.com</p>
          </div>

          <div>
             <h3 class="font-bold text-gray-900">Phone</h3>
             <p class="text-gray-600">+1 (555) 123-4567</p>
             <p class="text-sm text-gray-400">Mon-Fri 9am-6pm CST</p>
          </div>

          <div>
             <h3 class="font-bold text-gray-900">Office</h3>
             <p class="text-gray-600">
              123 Tech Avenue, Suite 400<br />
              Austin, TX 78701
             </p>
          </div>
        </div>
      `,
    }
  ]

  console.log('Start seeding system settings...')
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'global' }
  })

  if (!settings) {
    await prisma.systemSettings.create({
      data: {
        id: 'global',
        platformName: 'Phone Master',
        supportEmail: 'support@phonemaster.com',
        facebookUrl: 'https://facebook.com/phonemaster',
        instagramUrl: 'https://instagram.com/phonemaster',
        xUrl: 'https://x.com/phonemaster',
        linkedInUrl: 'https://linkedin.com/company/phonemaster',
        commissionRate: 10.0,
        minWithdrawal: 1000,
        maxWithdrawal: 100000,
      }
    })
    console.log('Created default system settings with social links.')
  } else {
    // Ensure social links are at least placeholder if none exist
    await prisma.systemSettings.update({
      where: { id: 'global' },
      data: {
        facebookUrl: settings.facebookUrl || 'https://facebook.com',
        instagramUrl: settings.instagramUrl || 'https://instagram.com',
        xUrl: settings.xUrl || 'https://x.com',
        linkedInUrl: settings.linkedInUrl || 'https://linkedin.com',
      }
    })
    console.log('Verified system settings and social links.')
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
