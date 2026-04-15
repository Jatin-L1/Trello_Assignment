const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  console.log('Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: '11111111-1111-1111-1111-111111111111',
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
      },
    }),
    prisma.user.create({
      data: {
        id: '22222222-2222-2222-2222-222222222222',
        username: 'jane_smith',
        email: 'jane@example.com',
        fullName: 'Jane Smith',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
      },
    }),
    prisma.user.create({
      data: {
        id: '33333333-3333-3333-3333-333333333333',
        username: 'bob_wilson',
        email: 'bob@example.com',
        fullName: 'Bob Wilson',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
      },
    }),
    prisma.user.create({
      data: {
        id: '44444444-4444-4444-4444-444444444444',
        username: 'alice_brown',
        email: 'alice@example.com',
        fullName: 'Alice Brown',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Create boards
  console.log('Creating boards...');
  const board1 = await prisma.board.create({
    data: {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      title: 'Product Roadmap',
      description: 'Q1 2024 Product Development',
      backgroundColor: '#0079bf',
      createdById: '11111111-1111-1111-1111-111111111111',
      boardMembers: {
        create: [
          { userId: '11111111-1111-1111-1111-111111111111', role: 'admin' },
          { userId: '22222222-2222-2222-2222-222222222222', role: 'member' },
          { userId: '33333333-3333-3333-3333-333333333333', role: 'member' },
        ],
      },
    },
  });

  const board2 = await prisma.board.create({
    data: {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      title: 'Marketing Campaign',
      description: 'Spring 2024 Marketing Initiatives',
      backgroundColor: '#d29034',
      createdById: '22222222-2222-2222-2222-222222222222',
      boardMembers: {
        create: [
          { userId: '22222222-2222-2222-2222-222222222222', role: 'admin' },
          { userId: '44444444-4444-4444-4444-444444444444', role: 'member' },
        ],
      },
    },
  });

  const board3 = await prisma.board.create({
    data: {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      title: 'Personal Tasks',
      description: 'My daily todo list',
      backgroundColor: '#519839',
      createdById: '11111111-1111-1111-1111-111111111111',
      boardMembers: {
        create: [{ userId: '11111111-1111-1111-1111-111111111111', role: 'admin' }],
      },
    },
  });
  console.log('✅ Created 3 boards');

  // Create lists for Product Roadmap
  console.log('Creating lists...');
  const lists = await Promise.all([
    prisma.list.create({
      data: {
        id: '10000000-0000-0000-0000-000000000001',
        boardId: board1.id,
        title: 'Backlog',
        position: 0,
      },
    }),
    prisma.list.create({
      data: {
        id: '10000000-0000-0000-0000-000000000002',
        boardId: board1.id,
        title: 'In Progress',
        position: 1,
      },
    }),
    prisma.list.create({
      data: {
        id: '10000000-0000-0000-0000-000000000003',
        boardId: board1.id,
        title: 'Review',
        position: 2,
      },
    }),
    prisma.list.create({
      data: {
        id: '10000000-0000-0000-0000-000000000004',
        boardId: board1.id,
        title: 'Done',
        position: 3,
      },
    }),
    // Marketing board lists
    prisma.list.create({
      data: {
        boardId: board2.id,
        title: 'Ideas',
        position: 0,
      },
    }),
    prisma.list.create({
      data: {
        boardId: board2.id,
        title: 'Planning',
        position: 1,
      },
    }),
    prisma.list.create({
      data: {
        boardId: board2.id,
        title: 'Executing',
        position: 2,
      },
    }),
    // Personal board lists
    prisma.list.create({
      data: {
        boardId: board3.id,
        title: 'To Do',
        position: 0,
      },
    }),
    prisma.list.create({
      data: {
        boardId: board3.id,
        title: 'Doing',
        position: 1,
      },
    }),
    prisma.list.create({
      data: {
        boardId: board3.id,
        title: 'Done',
        position: 2,
      },
    }),
  ]);
  console.log(`✅ Created ${lists.length} lists`);

  // Create labels
  console.log('Creating labels...');
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        id: 'l0000001-0000-0000-0000-000000000001',
        boardId: board1.id,
        name: 'High Priority',
        color: '#eb5a46',
      },
    }),
    prisma.label.create({
      data: {
        id: 'l0000002-0000-0000-0000-000000000002',
        boardId: board1.id,
        name: 'Bug',
        color: '#c377e0',
      },
    }),
    prisma.label.create({
      data: {
        id: 'l0000003-0000-0000-0000-000000000003',
        boardId: board1.id,
        name: 'Feature',
        color: '#61bd4f',
      },
    }),
    prisma.label.create({
      data: {
        id: 'l0000004-0000-0000-0000-000000000004',
        boardId: board1.id,
        name: 'Design',
        color: '#ff9f1a',
      },
    }),
  ]);
  console.log(`✅ Created ${labels.length} labels`);

  // Create cards
  console.log('Creating cards...');
  const card1 = await prisma.card.create({
    data: {
      id: 'c0000001-0000-0000-0000-000000000001',
      listId: '10000000-0000-0000-0000-000000000001',
      title: 'User Authentication System',
      description: 'Implement OAuth2 and JWT authentication',
      position: 0,
      createdById: '11111111-1111-1111-1111-111111111111',
      cardLabels: {
        create: [
          { labelId: 'l0000001-0000-0000-0000-000000000001' },
          { labelId: 'l0000003-0000-0000-0000-000000000003' },
        ],
      },
      cardMembers: {
        create: [
          { userId: '11111111-1111-1111-1111-111111111111' },
          { userId: '33333333-3333-3333-3333-333333333333' },
        ],
      },
    },
  });

  await prisma.card.createMany({
    data: [
      {
        listId: '10000000-0000-0000-0000-000000000001',
        title: 'Dashboard Analytics',
        description: 'Create analytics dashboard with charts',
        position: 1,
        createdById: '11111111-1111-1111-1111-111111111111',
      },
      {
        listId: '10000000-0000-0000-0000-000000000001',
        title: 'Mobile App Development',
        description: 'Build React Native mobile app',
        position: 2,
        createdById: '22222222-2222-2222-2222-222222222222',
      },
      {
        listId: '10000000-0000-0000-0000-000000000002',
        title: 'API Documentation',
        description: 'Write comprehensive API docs using Swagger',
        position: 0,
        createdById: '33333333-3333-3333-3333-333333333333',
      },
      {
        listId: '10000000-0000-0000-0000-000000000002',
        title: 'Payment Integration',
        description: 'Integrate Stripe payment gateway',
        position: 1,
        createdById: '11111111-1111-1111-1111-111111111111',
      },
    ],
  });
  console.log('✅ Created cards');

  // Create checklist
  console.log('Creating checklists...');
  const checklist = await prisma.checklist.create({
    data: {
      cardId: card1.id,
      title: 'Implementation Tasks',
      position: 0,
      items: {
        create: [
          { title: 'Setup OAuth providers', isCompleted: true, position: 0 },
          { title: 'Implement JWT tokens', isCompleted: true, position: 1 },
          { title: 'Add refresh token logic', isCompleted: false, position: 2 },
          { title: 'Write unit tests', isCompleted: false, position: 3 },
        ],
      },
    },
  });
  console.log('✅ Created checklists');

  // Create comments
  console.log('Creating comments...');
  await prisma.comment.createMany({
    data: [
      {
        cardId: card1.id,
        userId: '11111111-1111-1111-1111-111111111111',
        content: 'Started working on the OAuth implementation. Google and GitHub providers are ready.',
      },
      {
        cardId: card1.id,
        userId: '33333333-3333-3333-3333-333333333333',
        content: "Great! I'll handle the JWT token generation and validation.",
      },
    ],
  });
  console.log('✅ Created comments');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
