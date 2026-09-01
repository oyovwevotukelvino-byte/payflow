import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const invoices = await prisma.invoice.findMany({
    where: {
      publicToken: null,
    },
    select: {
      id: true,
      invoiceNumber: true,
    },
  });

  console.log(`Found ${invoices.length} invoice(s) without public tokens.`);

  for (const invoice of invoices) {
    const publicToken = randomBytes(32).toString("hex");

    await prisma.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        publicToken,
      },
    });

    console.log(`✓ ${invoice.invoiceNumber}: ${publicToken}`);
  }

  console.log("Backfill complete.");
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });