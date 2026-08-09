import { PrismaClient } from './prisma/generated/prisma/client/index.js';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const execs = await prisma.user.findMany({
      where: { 
        role: 'Department Executive',
        isActive: true 
      },
      select: { id: true, email: true, role: true, name: true }
    });
    
    console.log('\n=== Department Executive Users ===');
    console.log('Total found:', execs.length);
    console.log('');
    execs.forEach(u => {
      const emailStatus = u.email ? u.email : '❌ NO EMAIL';
      console.log(`User ID: ${u.id}`);
      console.log(`  Name: ${u.name || '(no name)'}`);
      console.log(`  Email: ${emailStatus}`);
      console.log('');
    });
    
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUsers();
