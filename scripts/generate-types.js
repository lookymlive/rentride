#!/usr/bin/env node

/**
 * Generate TypeScript types from Supabase database
 * Run: node scripts/generate-types.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_PROJECT_ID = 'ymbfktjlmzlepjujaxxw';
const OUTPUT_FILE = path.join(__dirname, '../src/types/supabase.ts');

console.log('🔄 Generating TypeScript types from Supabase...\n');

// Check if Supabase CLI is installed
try {
  execSync('supabase --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Supabase CLI not found!');
  console.log('\n📦 Install it with:');
  console.log('   npm install -g supabase');
  console.log('   or');
  console.log('   brew install supabase/tap/supabase');
  process.exit(1);
}

// Check if logged in
try {
  execSync('supabase projects list', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Not logged in to Supabase!');
  console.log('\n🔐 Login with:');
  console.log('   supabase login');
  process.exit(1);
}

try {
  // Generate types
  console.log(`📊 Fetching schema from project: ${SUPABASE_PROJECT_ID}`);
  
  const command = `supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID}`;
  const types = execSync(command, { encoding: 'utf-8' });
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write types to file
  fs.writeFileSync(OUTPUT_FILE, types);
  
  console.log(`✅ Types generated successfully!`);
  console.log(`📁 Output: ${OUTPUT_FILE}\n`);
  
  // Show file size
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`📏 File size: ${(stats.size / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('❌ Error generating types:', error.message);
  console.log('\n💡 Make sure:');
  console.log('   1. You are logged in: supabase login');
  console.log('   2. Project ID is correct');
  console.log('   3. You have access to the project');
  process.exit(1);
}
