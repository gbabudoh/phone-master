#!/usr/bin/env node

/**
 * Generate a secure JWT secret key
 * Usage: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated JWT Secret:\n');
console.log(secret);
console.log('\n📝 Add this to your .env.local file as:');
console.log(`JWT_SECRET=${secret}\n`);

