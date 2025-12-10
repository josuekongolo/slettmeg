import { PrismaClient } from '@prisma/client';
import { platforms } from '../lib/platforms-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed platforms
  let created = 0;
  let updated = 0;

  for (const platform of platforms) {
    const existing = await prisma.platform.findUnique({
      where: { slug: platform.slug },
    });

    if (existing) {
      await prisma.platform.update({
        where: { slug: platform.slug },
        data: {
          name: platform.name,
          category: platform.category,
          description: platform.description,
          difficulty: platform.difficulty,
          estimatedTime: platform.estimatedTime,
          guideUrl: platform.guideUrl || null,
        },
      });
      updated++;
    } else {
      await prisma.platform.create({
        data: {
          name: platform.name,
          slug: platform.slug,
          category: platform.category,
          description: platform.description,
          difficulty: platform.difficulty,
          estimatedTime: platform.estimatedTime,
          guideUrl: platform.guideUrl || null,
        },
      });
      created++;
    }
  }

  console.log(`✅ Seeded ${created} new platforms`);
  console.log(`📝 Updated ${updated} existing platforms`);
  console.log(`🎉 Total platforms in database: ${created + updated}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
