/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.listingUpdateRequest.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.leadRequest.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: "user-1",
        name: "Thula Buyer",
        email: "buyer@thula.local",
        password: "demo1234",
        role: "user",
        verificationStatus: "pending",
        referenceNumber: "TH-BUY-001",
        phone: "+27 82 000 0001",
      },
      {
        id: "admin-1",
        name: "Thula Admin",
        email: "admin@thula.local",
        password: "demo1234",
        role: "admin",
        verificationStatus: "verified",
        referenceNumber: "TH-ADM-001",
        phone: "+27 82 000 0002",
      },
      {
        id: "seller-1",
        name: "Thula Seller",
        email: "seller@thula.local",
        password: "demo1234",
        role: "seller",
        verificationStatus: "pending",
        referenceNumber: "TH-SEL-001",
        phone: "+27 82 000 0003",
      },
      {
        id: "operator-1",
        name: "Thula Operations",
        email: "ops@thula.local",
        password: "demo1234",
        role: "operator",
        verificationStatus: "verified",
        referenceNumber: "TH-OPS-001",
        phone: "+27 82 000 0004",
      },
    ],
  });

  await prisma.listing.createMany({
    data: [
      {
        slug: "thula-esv-explorer-tx-145",
        sellerId: "seller-1",
        sellerName: "Thula Seller",
        model: "Thula ESV",
        code: "TX-145",
        reservePrice: "R 1 850 000",
        currentListPrice: "R 1 640 000",
        serialLabel: "Fleet Range 120-145",
        status: "open",
        verified: true,
        description:
          "Reserve-led listing presentation with the same progression toward an offer, invoice, and document workflow.",
        payableNowBase: 145000,
        serviceFeeRate: 0.05,
        imageUrls: [
          "https://thula.africa/images/img_esv_section02_01.jpg",
          "https://thula.africa/images/img_home_section02_01.jpg",
          "https://thula.africa/images/IMG_9769-1.jpg",
        ],
        updateRequestStatus: "none",
      },
      {
        slug: "thula-esv-safari-xl-tx-234",
        sellerId: "seller-1",
        sellerName: "Thula Seller",
        model: "Thula ESV",
        code: "TX-234",
        reservePrice: "R 2 240 000",
        currentListPrice: "R 2 020 000",
        serialLabel: "Fleet Range 210-234",
        status: "under_offer",
        verified: true,
        description:
          "Structured like the current under-offer marketplace cards so transaction state remains visible without changing the flow.",
        payableNowBase: 172000,
        serviceFeeRate: 0.05,
        imageUrls: [
          "https://thula.africa/images/IMG_9501.png",
          "https://thula.africa/images/img_esv_section02_01.jpg",
          "https://thula.africa/images/img_home_section02_01.jpg",
        ],
        updateRequestStatus: "none",
      },
      {
        slug: "thula-esv-reserve-pro-tx-327",
        sellerId: "seller-1",
        sellerName: "Thula Seller",
        model: "Thula ESV",
        code: "TX-327",
        reservePrice: "R 2 680 000",
        currentListPrice: "R 2 420 000",
        serialLabel: "Fleet Range 301-327",
        status: "open",
        verified: false,
        description:
          "The right-side price stack and action area are kept deliberately close to the existing listing composition.",
        payableNowBase: 198000,
        serviceFeeRate: 0.05,
        imageUrls: [
          "https://thula.africa/images/IMG_9769-1.jpg",
          "https://thula.africa/images/IMG_9501.png",
          "https://thula.africa/images/img_home_section02_01.jpg",
        ],
        updateRequestStatus: "none",
      },
    ],
  });

  await prisma.pageContent.createMany({
    data: [
      {
        slug: "home",
        eyebrow: "Experience Nature Like Never Before",
        title: "SILENT. SUSTAINABLE. UNFORGETTABLE.",
        description:
          "Thula is repositioning this platform around electric safari vehicles for lodges, reserves, and operators who want quieter drives, lower operating impact, and a better guest experience.",
      },
      {
        slug: "contact",
        eyebrow: "Contact",
        title: "Get in touch with THULA.",
        description:
          "Connect with the team about fleet acquisition, reserve deployment planning, and how the marketplace workflow can support your operation.",
      },
    ],
  });

  await prisma.siteSetting.create({
    data: {
      id: "default",
      supportEmail: "info@thula.africa",
      supportPhone: "+27 82 000 0000",
      globalListPrice: "R 1 640 000",
      testEmailStatus: "idle",
    },
  });

  await prisma.verificationDocument.createMany({
    data: [
      {
        id: "vdoc-user-1",
        userId: "user-1",
        name: "Buyer Identity Pack",
        party: "user",
        status: "pending",
      },
      {
        id: "vdoc-seller-1",
        userId: "seller-1",
        name: "Seller Compliance Pack",
        party: "seller",
        status: "pending",
      },
    ],
  });

  await prisma.partner.createMany({
    data: [
      {
        id: "partner-1",
        name: "Lowveld Lodge Group",
        category: "Reserve Partner",
        status: "active",
      },
      {
        id: "partner-2",
        name: "Silent Safari Mobility",
        category: "Technology Partner",
        status: "draft",
      },
    ],
  });

  await prisma.walletTransaction.createMany({
    data: [
      {
        id: "wallet-1",
        userId: "user-1",
        type: "refund",
        amount: "R 145 000",
        status: "pending",
        proofName: "refund-proof.pdf",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
