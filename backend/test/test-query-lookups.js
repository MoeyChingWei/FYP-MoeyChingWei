import prisma from './config/prisma.js';

async function queryLookups() {
  try {
    const lookups = await prisma.purchasingLookup.findMany();

    const categories = lookups.filter(l => l.kind === 'category');
    const units = lookups.filter(l => l.kind === 'unit');

    console.log('Categories:', categories);
    console.log('Units:', units);

    // Also check for a sample purchase request
    const sampleRequest = await prisma.purchaseRequestRecord.findFirst();
    console.log('Sample Purchase Request:', JSON.stringify(sampleRequest?.payload, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

queryLookups();
