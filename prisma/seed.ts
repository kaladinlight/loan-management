import 'dotenv/config';
import { PrismaClient, LoanPurpose, LoanStatus } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const loans = [
  {
    loanNumber: 'LN-00001',
    purpose: LoanPurpose.MORTGAGE,
    borrowerName: 'Alice Johnson',
    borrowerEmail: 'alice.johnson@example.com',
    amount: 350000,
    interestRate: 6.5,
    term: 360,
    status: LoanStatus.ACTIVE,
    startDate: new Date('2024-01-15'),
  },
  {
    loanNumber: 'LN-00002',
    purpose: LoanPurpose.AUTO,
    borrowerName: 'Bob Smith',
    borrowerEmail: 'bob.smith@example.com',
    amount: 28000,
    interestRate: 4.9,
    term: 60,
    status: LoanStatus.ACTIVE,
    startDate: new Date('2024-03-01'),
  },
  {
    loanNumber: 'LN-00003',
    purpose: LoanPurpose.PERSONAL,
    borrowerName: 'Carol Davis',
    borrowerEmail: 'carol.davis@example.com',
    amount: 15000,
    interestRate: 8.25,
    term: 36,
    status: LoanStatus.PAID,
    startDate: new Date('2023-06-10'),
  },
  {
    loanNumber: 'LN-00004',
    purpose: LoanPurpose.BUSINESS,
    borrowerName: 'David Chen',
    borrowerEmail: 'david.chen@example.com',
    amount: 500000,
    interestRate: 7.0,
    term: 120,
    status: LoanStatus.ACTIVE,
    startDate: new Date('2024-02-20'),
  },
  {
    loanNumber: 'LN-00005',
    purpose: LoanPurpose.PERSONAL,
    borrowerName: 'Eva Martinez',
    borrowerEmail: 'eva.martinez@example.com',
    amount: 10000,
    interestRate: 9.5,
    term: 24,
    status: LoanStatus.PENDING,
    startDate: new Date('2025-01-01'),
  },
  {
    loanNumber: 'LN-00006',
    purpose: LoanPurpose.MORTGAGE,
    borrowerName: 'Frank Wilson',
    borrowerEmail: 'frank.wilson@example.com',
    amount: 275000,
    interestRate: 5.75,
    term: 240,
    status: LoanStatus.DEFAULTED,
    startDate: new Date('2022-08-15'),
  },
  {
    loanNumber: 'LN-00007',
    purpose: LoanPurpose.AUTO,
    borrowerName: 'Grace Lee',
    borrowerEmail: 'grace.lee@example.com',
    amount: 42000,
    interestRate: 3.9,
    term: 72,
    status: LoanStatus.ACTIVE,
    startDate: new Date('2024-05-10'),
  },
  {
    loanNumber: 'LN-00008',
    purpose: LoanPurpose.OTHER,
    borrowerName: 'Henry Patel',
    borrowerEmail: 'henry.patel@example.com',
    amount: 8000,
    interestRate: 11.0,
    term: 12,
    status: LoanStatus.PAID,
    startDate: new Date('2024-01-01'),
  },
  {
    loanNumber: 'LN-00009',
    purpose: LoanPurpose.BUSINESS,
    borrowerName: 'Irene Thompson',
    borrowerEmail: 'irene.thompson@example.com',
    amount: 150000,
    interestRate: 6.25,
    term: 84,
    status: LoanStatus.PENDING,
    startDate: new Date('2025-02-01'),
  },
  {
    loanNumber: 'LN-00010',
    purpose: LoanPurpose.PERSONAL,
    borrowerName: 'James Brown',
    borrowerEmail: 'james.brown@example.com',
    amount: 20000,
    interestRate: 7.75,
    term: 48,
    status: LoanStatus.ACTIVE,
    startDate: new Date('2024-07-01'),
  },
  {
    loanNumber: 'LN-00011',
    purpose: LoanPurpose.MORTGAGE,
    borrowerName: 'Karen White',
    borrowerEmail: 'karen.white@example.com',
    amount: 420000,
    interestRate: 6.0,
    term: 360,
    status: LoanStatus.PENDING,
    startDate: new Date('2025-03-01'),
  },
  {
    loanNumber: 'LN-00012',
    purpose: LoanPurpose.AUTO,
    borrowerName: 'Leo Garcia',
    borrowerEmail: 'leo.garcia@example.com',
    amount: 35000,
    interestRate: 5.5,
    term: 48,
    status: LoanStatus.DEFAULTED,
    startDate: new Date('2023-09-15'),
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.loan.deleteMany();

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
