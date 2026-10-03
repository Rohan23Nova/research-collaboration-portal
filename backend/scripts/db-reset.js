// scripts/db-reset.js
// Drops and recreates all tables (schema.sql) then inserts seed data (seed.sql).
// Run with: npm run db:reset  (from the backend/ folder)
//
// How it works:
//   1. Read both SQL files from disk
//   2. Split on semicolons to get individual statements
//   3. Execute each statement sequentially using the mysql2 pool
//   4. Print a final row-count summary so you know it worked
//
// WARNING: This DESTROYS all existing data. Development use only.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// __dirname equivalent for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to the database/ folder (two levels up from backend/scripts/)
const DB_DIR = resolve(__dirname, '../../database');

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Split a SQL file into individual executable statements.
 * Strategy:
 *   1. Remove single-line comments (-- ...) line by line
 *   2. Split on semicolons
 *   3. Skip empty strings
 * This handles inline comments inside CREATE TABLE blocks correctly.
 */
function splitStatements(sql) {
  // Step 1: remove single-line SQL comments
  const stripped = sql
    .split('\n')
    .map(line => {
      // Remove -- comment from the line, but preserve the line itself
      // (important: don't strip lines that ARE entirely comments — just
      //  remove the comment portion so the surrounding SQL stays intact)
      const commentIdx = line.indexOf('--');
      return commentIdx >= 0 ? line.substring(0, commentIdx) : line;
    })
    .join('\n');

  // Step 2: split on semicolons and clean up
  return stripped
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Execute an array of SQL statements sequentially on a connection.
 * Logs each statement type (CREATE TABLE, INSERT, etc.) for visibility.
 */
async function runStatements(conn, statements, label) {
  let count = 0;
  for (const stmt of statements) {
    const preview = stmt.split('\n')[0].trim().substring(0, 60);
    try {
      await conn.query(stmt);
      count++;
      process.stdout.write(`  ✓ ${preview}\n`);
    } catch (err) {
      // Skip "empty statement" errors from double semicolons
      if (err.code !== 'ER_EMPTY_QUERY') {
        console.error(`  ✗ FAILED: ${preview}`);
        console.error(`    Error: ${err.message}`);
        throw err;
      }
    }
  }
  console.log(`\n${label}: ${count} statements executed.\n`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const pool = mysql.createPool({
    host:            process.env.DB_HOST     || 'localhost',
    port:            parseInt(process.env.DB_PORT || '3306'),
    user:            process.env.DB_USER     || 'root',
    password:        process.env.DB_PASSWORD || '',
    database:        process.env.DB_NAME     || 'research_portal',
    multipleStatements: false,  // we run one statement at a time for safe error handling
    connectionLimit: 1,
  });

  const conn = await pool.getConnection();

  try {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║        Research Collaboration Portal             ║');
    console.log('║            Database Reset Script                 ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
    console.log(`Database: ${process.env.DB_NAME || 'research_portal'} @ ${process.env.DB_HOST || 'localhost'}\n`);

    // ── Step 1: Apply schema ────────────────────────────────────────────────
    console.log('[ Step 1 ] Applying schema.sql …\n');
    const schemaSQL = readFileSync(resolve(DB_DIR, 'schema.sql'), 'utf8');
    const schemaStmts = splitStatements(schemaSQL);
    await runStatements(conn, schemaStmts, 'Schema');

    // ── Step 2: Apply seed data ─────────────────────────────────────────────
    console.log('[ Step 2 ] Applying seed.sql …\n');
    const seedSQL = readFileSync(resolve(DB_DIR, 'seed.sql'), 'utf8');
    const seedStmts = splitStatements(seedSQL);
    await runStatements(conn, seedStmts, 'Seed');

    // ── Step 3: Row count summary ────────────────────────────────────────────
    console.log('[ Step 3 ] Row count verification:\n');
    const tables = [
      'User', 'Skill', 'UserSkill', 'ResearchProject', 'ProjectSkill',
      'CollaborationRequest', 'ProjectMember', 'Document', 'Milestone',
      'Task', 'ProgressReport', 'Message', 'Notification',
    ];

    let allGood = true;
    for (const table of tables) {
      const [[row]] = await conn.query(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
      const cnt = row.cnt;
      const icon = cnt > 0 ? '✅' : '⚠️ ';
      if (cnt === 0) allGood = false;
      console.log(`  ${icon}  ${table.padEnd(22)} ${cnt} rows`);
    }

    console.log('\n' + (allGood
      ? '🎉 All tables populated. Database is ready!'
      : '⚠️  Some tables are empty — check seed.sql for errors.'));

    console.log('\n📋 Test credentials (all passwords: Password@123)');
    console.log('  admin@rcportal.edu   — ADMIN');
    console.log('  dr.sharma@iit.edu    — FACULTY');
    console.log('  prof.mehta@nit.edu   — FACULTY');
    console.log('  alice.chen@student.edu — STUDENT');
    console.log('  bob.kumar@student.edu  — STUDENT');
    console.log('  carol.patel@student.edu— STUDENT');
    console.log('  david.singh@student.edu— STUDENT');
    console.log('  lisa.park@techcorp.com — EXTERNAL\n');

  } catch (err) {
    console.error('\n❌ Database reset failed:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

main();
