import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to Azure SQL Database...');
    const pool = await sql.connect(config);
    console.log('✅ Connected!');

    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split by GO statements (SQL Server batch separator)
    const batches = schemaSql.split(/\bGO\b/gi).filter(batch => batch.trim());

    console.log(`📝 Executing ${batches.length} SQL batches...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (batch) {
        console.log(`   Batch ${i + 1}/${batches.length}...`);
        await pool.request().query(batch);
      }
    }

    console.log('✅ Database schema created successfully!');

    // Seed Holidays table
    const holidaysSeedPath = path.join(__dirname, '../../database/seeds/holidays.sql');
    const holidaysSeedSql = fs.readFileSync(holidaysSeedPath, 'utf8');
    const holidayBatches = holidaysSeedSql.split(/;\s*\n/).filter(batch => batch.trim());
    console.log(`🌱 Seeding Holidays table with ${holidayBatches.length} entries...`);
    for (let i = 0; i < holidayBatches.length; i++) {
      const batch = holidayBatches[i].trim();
      if (batch) {
        await pool.request().query(batch);
      }
    }
    console.log('✅ Holidays table seeded successfully!');
    await pool.close();
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

setupDatabase();
