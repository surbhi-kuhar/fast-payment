import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

async function main() {
  const derek = await prisma.user.upsert({
    where: { number: '1111155555' },
    update: {},
    create: {
      number: '1111155555',
      password: await bcrypt.hash('derek', 10),
      name: 'derek',
      Balance: {
        create: {
            amount: 20000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "token__3",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const ram = await prisma.user.upsert({
    where: { number: '2222255555' },
    update: {},
    create: {
      number: '2222255555',
      password: await bcrypt.hash('ram', 10),
      name: 'ram',
      Balance: {
        create: {
            amount: 2000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "token__4",
          provider: "HDFC Bank",
        },
      },
    },
  })
  console.log({ derek, ram })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })