import { PrismaClient } from './prisma/generated/prisma/client/index.js';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('\n=== Checking Department Executive Users ===\n');
    
    const execs = await prisma.user.findMany({
      where: { 
        role: 'Department Executive',
        isActive: true 
      },
      select: { id: true, email: true, role: true, name: true }
    });
    
    console.log('Total Department Executive users found:', execs.length);
    console.log('');
    
    if (execs.length === 0) {
      console.log('❌ No Department Executive users found in database!');
      console.log('');
    } else {
      execs.forEach((u, idx) => {
        console.log(`[${idx + 1}] User ID: ${u.id}`);
        console.log(`    Name: ${u.name || '(no name)'}`);
        console.log(`    Role: ${u.role}`);
        console.log(`    Email: ${u.email || '❌ NO EMAIL CONFIGURED'}`);
        console.log('');
      });
      
      const usersWithoutEmail = execs.filter(u => !u.email || u.email.trim() === '');
      if (usersWithoutEmail.length > 0) {
        console.log(`⚠️  WARNING: ${usersWithoutEmail.length} user(s) have no email configured!`);
        console.log('These users will NOT receive email notifications.\n');
      }
    }
    
    await prisma.$disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUsers();
