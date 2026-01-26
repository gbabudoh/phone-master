#!/usr/bin/env node

/**
 * Setup environment file from template
 * Usage: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'env.local.template');
const envPath = path.join(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('   Delete it first if you want to regenerate it.\n');
  process.exit(0);
}

if (!fs.existsSync(templatePath)) {
  console.error('❌ env.local.template not found!');
  process.exit(1);
}

try {
  const template = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(envPath, template);
  console.log('✅ Created .env.local from template');
  console.log('📝 Please update the values in .env.local with your actual configuration\n');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  process.exit(1);
}

