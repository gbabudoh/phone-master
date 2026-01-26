#!/usr/bin/env node

/**
 * Drop the username index from users collection
 * Run this once to fix the duplicate key error
 * Usage: node scripts/drop-username-index.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phone-master';

async function dropUsernameIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get all indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);

    // Drop username index if it exists
    try {
      await usersCollection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  username_1 index does not exist (already dropped)');
      } else {
        throw error;
      }
    }

    // Also try dropping any other username-related indexes
    try {
      await usersCollection.dropIndex('username');
      console.log('✅ Successfully dropped username index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  username index does not exist');
      } else {
        throw error;
      }
    }

    // Show updated indexes
    const updatedIndexes = await usersCollection.indexes();
    console.log('\nUpdated indexes:', updatedIndexes);

    console.log('\n✅ Index cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

dropUsernameIndex();

