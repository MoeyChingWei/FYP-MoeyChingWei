const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupPath = path.join(__dirname, 'Old Data', 'Currently Data for starting', 'current_database_backup_20260815.sql');

// Ensure directory exists
const dir = path.dirname(backupPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const command = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe" -h localhost -p 5432 -U postgres -d FYPData -F p -f "${backupPath}"`;

console.log('Starting database backup...');
console.log(`Backup path: ${backupPath}`);

const env = { ...process.env, PGPASSWORD: 'FYP123' };

exec(command, { env }, (error, stdout, stderr) => {
  if (error) {
    console.error('Backup failed:', error.message);
    if (stderr) console.error('Error details:', stderr);
    process.exit(1);
  }

  if (stderr) console.log('pg_dump output:', stderr);

  const stats = fs.statSync(backupPath);
  console.log(`✅ Backup completed successfully!`);
  console.log(`File: ${backupPath}`);
  console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
});
