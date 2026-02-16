import dotenv from 'dotenv';
import { runMigrations } from '../database/db';
import contentGenerator from '../services/content.generator';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🐝 Starting content pre-generation...\n');

  // Ensure database is set up
  runMigrations();

  // Pre-generate content for Grade 2 (all 10 levels)
  const grade = 2;
  console.log(`Generating content for Grade ${grade}...\n`);

  try {
    await contentGenerator.preGenerateContent(grade, 10);
    console.log('\n✅ Content pre-generation complete!');
    console.log('All word lists and story packs have been cached in the database.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during pre-generation:', error);
    process.exit(1);
  }
}

main();
