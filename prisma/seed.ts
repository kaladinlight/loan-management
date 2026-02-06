/* eslint-disable no-console */
import 'dotenv/config'

import { faker } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'

import { LoanPurpose, LoanStatus, PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const purposes = Object.values(LoanPurpose)
const statuses = Object.values(LoanStatus)

interface LoanSeedData {
  loanNumber: string
  purpose: LoanPurpose
  borrowerName: string
  borrowerEmail: string
  amount: number
  interestRate: number
  term: number
  status: LoanStatus
  startDate: Date
}

function generateLoanData(purpose: LoanPurpose): Pick<LoanSeedData, 'amount' | 'term' | 'interestRate'> {
  switch (purpose) {
    case LoanPurpose.MORTGAGE:
      return {
        amount: faker.number.int({ min: 200_000, max: 500_000 }),
        term: faker.helpers.arrayElement([180, 240, 360]),
        interestRate: faker.number.float({ min: 5.5, max: 7.5, fractionDigits: 2 }),
      }
    case LoanPurpose.AUTO:
      return {
        amount: faker.number.int({ min: 15_000, max: 65_000 }),
        term: faker.helpers.arrayElement([36, 48, 60, 72]),
        interestRate: faker.number.float({ min: 3.5, max: 7.5, fractionDigits: 2 }),
      }
    case LoanPurpose.PERSONAL:
      return {
        amount: faker.number.int({ min: 5_000, max: 30_000 }),
        term: faker.helpers.arrayElement([12, 24, 36, 48]),
        interestRate: faker.number.float({ min: 7, max: 12, fractionDigits: 2 }),
      }
    case LoanPurpose.BUSINESS:
      return {
        amount: faker.number.int({ min: 50_000, max: 500_000 }),
        term: faker.helpers.arrayElement([60, 84, 120]),
        interestRate: faker.number.float({ min: 6, max: 9, fractionDigits: 2 }),
      }
    default:
      return {
        amount: faker.number.int({ min: 3_000, max: 20_000 }),
        term: faker.helpers.arrayElement([6, 12, 18, 24]),
        interestRate: faker.number.float({ min: 8, max: 14, fractionDigits: 2 }),
      }
  }
}

function generateLoans(count: number): LoanSeedData[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const purpose = faker.helpers.arrayElement(purposes)

    return {
      loanNumber: `LN-${String(i + 1)}`,
      purpose,
      borrowerName: `${firstName} ${lastName}`,
      borrowerEmail: faker.internet.email({ firstName, lastName }).toLowerCase(),
      status: faker.helpers.arrayElement(statuses),
      startDate: faker.date.between({ from: '2023-01-01', to: '2025-12-31' }),
      ...generateLoanData(purpose),
    }
  })
}

async function main(): Promise<void> {
  console.log('Seeding database...')

  await prisma.loan.deleteMany()
  await prisma.$executeRaw`SELECT setval('loan_number_seq', 1, false)`

  const loans = generateLoans(100)

  await prisma.loan.createMany({ data: loans })
  await prisma.$executeRaw`SELECT setval('loan_number_seq', 100, true)`

  console.log(`Seeded ${loans.length} loans.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
