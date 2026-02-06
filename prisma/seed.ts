/* eslint-disable no-console */
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { LoanPurpose, LoanStatus, PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const firstNames = [
  'Alice',
  'Bob',
  'Carol',
  'David',
  'Eva',
  'Frank',
  'Grace',
  'Henry',
  'Irene',
  'James',
  'Karen',
  'Leo',
  'Maria',
  'Nathan',
  'Olivia',
  'Peter',
  'Quinn',
  'Rachel',
  'Samuel',
  'Tina',
];

const lastNames = [
  'Johnson',
  'Smith',
  'Davis',
  'Chen',
  'Martinez',
  'Wilson',
  'Lee',
  'Patel',
  'Thompson',
  'Brown',
  'White',
  'Garcia',
  'Kim',
  'Anderson',
  'Taylor',
  'Moore',
  'Jackson',
  'Harris',
  'Clark',
  'Lewis',
];

const purposes = [
  LoanPurpose.MORTGAGE,
  LoanPurpose.AUTO,
  LoanPurpose.PERSONAL,
  LoanPurpose.BUSINESS,
  LoanPurpose.OTHER,
];
const statuses = [LoanStatus.PENDING, LoanStatus.ACTIVE, LoanStatus.PAID, LoanStatus.DEFAULTED];

function generateLoans(count: number) {
  const loans = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const purpose = purposes[i % purposes.length];
    const status = statuses[i % statuses.length];

    let amount: number;
    let term: number;
    let interestRate: number;

    switch (purpose) {
      case LoanPurpose.MORTGAGE:
        amount = 200000 + Math.floor(Math.random() * 300000);
        term = [180, 240, 360][i % 3];
        interestRate = 5.5 + Math.random() * 2;
        break;
      case LoanPurpose.AUTO:
        amount = 15000 + Math.floor(Math.random() * 50000);
        term = [36, 48, 60, 72][i % 4];
        interestRate = 3.5 + Math.random() * 4;
        break;
      case LoanPurpose.PERSONAL:
        amount = 5000 + Math.floor(Math.random() * 25000);
        term = [12, 24, 36, 48][i % 4];
        interestRate = 7 + Math.random() * 5;
        break;
      case LoanPurpose.BUSINESS:
        amount = 50000 + Math.floor(Math.random() * 450000);
        term = [60, 84, 120][i % 3];
        interestRate = 6 + Math.random() * 3;
        break;
      default:
        amount = 3000 + Math.floor(Math.random() * 20000);
        term = [6, 12, 18, 24][i % 4];
        interestRate = 8 + Math.random() * 6;
    }

    const startYear = 2023 + (i % 3);
    const startMonth = (i % 12) + 1;
    const startDay = (i % 28) + 1;

    loans.push({
      loanNumber: `LN-${String(i).padStart(5, '0')}`,
      purpose,
      borrowerName: `${firstName} ${lastName}`,
      borrowerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      amount,
      interestRate: Math.round(interestRate * 100) / 100,
      term,
      status,
      startDate: new Date(`${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`),
    });
  }

  return loans;
}

async function main() {
  console.log('Seeding database...');

  await prisma.loan.deleteMany();

  const loans = generateLoans(100);

  for (const loan of loans) {
    await prisma.loan.create({ data: loan });
  }

  console.log(`Seeded ${loans.length} loans.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
