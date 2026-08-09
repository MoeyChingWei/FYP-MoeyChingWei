// Check if Department Executive users have email addresses configured
import 'dotenv/config';
import prisma from './config/prisma.js';
import { ROLES } from './constants/roles.js';

async function checkExecutiveEmails() {
  console.log("Checking Department Executive users for email configuration...\n");

  const executives = await prisma.user.findMany({
    where: {
      role: ROLES.DEPARTMENT_EXECUTIVE,
      isActive: true
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true
    },
  });

  console.log(`Found ${executives.length} active Department Executive users:\n`);

  executives.forEach((user, index) => {
    const hasEmail = user.email && String(user.email).trim().length > 0;
    console.log(`${index + 1}. User ID: ${user.id}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Email: ${user.email || 'NULL/EMPTY'}`);
    console.log(`   Has Valid Email: ${hasEmail ? '✅ YES' : '❌ NO'}`);
    console.log('');
  });

  const withEmail = executives.filter(u => u.email && String(u.email).trim().length > 0);
  const withoutEmail = executives.filter(u => !u.email || String(u.email).trim().length === 0);

  console.log("SUMMARY:");
  console.log(`✅ Department Executives WITH email: ${withEmail.length}`);
  console.log(`❌ Department Executives WITHOUT email: ${withoutEmail.length}`);

  if (withoutEmail.length > 0) {
    console.log("\n⚠️ WARNING: The following users will NOT receive email notifications:");
    withoutEmail.forEach(u => console.log(`   - User ID ${u.id}: ${u.name || 'Unknown'}`));
  }

  await prisma.$disconnect();
}

checkExecutiveEmails().catch(err => {
  console.error("Check failed:", err);
  process.exit(1);
});
