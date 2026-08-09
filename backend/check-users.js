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
    
    console.log('Department Executive users found:', execs.length);
    execs.forEach(u => {
      console.log('- ID:', u.id, '| Email:', u.email || '(NO EMAIL)', '| Name:', u.name || '(no name)');
    });
    
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    await prisma.$disconnect();
  }
}

checkUsers();
