// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@example.com',
      name: 'Instructor One',
      role: 'INSTRUCTOR',
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      name: 'Student One',
      role: 'STUDENT',
    },
  });

  // Create course
  const course = await prisma.course.create({
    data: {
      title: 'Intro to LMS',
      ownerId: instructor.id,
    },
  });

  // Enroll student
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });

  // Send a message
  await prisma.message.create({
    data: {
      content: 'Excited to start!',
      userId: student.id,
      courseId: course.id,
    },
  });

  console.log('✅ Dummy data inserted!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
