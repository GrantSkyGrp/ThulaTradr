type InvoicePdfInput = {
  invoiceNumber: string;
  issuedAt: string;
  listingModel: string;
  buyerName: string;
  buyerEmail: string;
  billingName: string;
  companyName: string;
  vatNumber: string;
  billingAddress: string;
  billingCellNumber: string;
  billingEmail: string;
  amount: string;
};

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildContentLines(input: InvoicePdfInput) {
  const lines = [
    "THULA INVOICE",
    `Invoice Number: ${input.invoiceNumber}`,
    `Issued: ${input.issuedAt}`,
    "",
    `Listing: ${input.listingModel}`,
    `Buyer: ${input.buyerName}`,
    `Buyer Email: ${input.buyerEmail}`,
    "",
    "Billing Details",
    `Full Name: ${input.billingName}`,
    `Company: ${input.companyName || "N/A"}`,
    `VAT: ${input.vatNumber || "N/A"}`,
    `Cell: ${input.billingCellNumber}`,
    `Billing Email: ${input.billingEmail}`,
    `Address: ${input.billingAddress}`,
    "",
    `Total Payable Now: ${input.amount}`,
    "",
    "Please use this invoice when submitting proof of payment.",
  ];

  return lines.map((line, index) => {
    const y = 780 - index * 22;
    return `BT /F1 12 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`;
  });
}

export function createInvoicePdfBuffer(input: InvoicePdfInput) {
  const content = buildContentLines(input).join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${object}\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}
