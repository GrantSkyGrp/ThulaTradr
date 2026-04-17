import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadRoot = path.join(process.cwd(), "data", "uploads", "buyer-agreements");

export function sanitizeAgreementFilename(filename: string) {
  return filename
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function getStoredAgreementPath(transactionId: string, filename: string) {
  const safeTransactionId = transactionId.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(uploadRoot, safeTransactionId, sanitizeAgreementFilename(filename));
}

export async function saveBuyerAgreementFile(transactionId: string, file: File) {
  const filename = sanitizeAgreementFilename(file.name);
  const storedPath = getStoredAgreementPath(transactionId, filename);

  await mkdir(path.dirname(storedPath), { recursive: true });
  await writeFile(storedPath, Buffer.from(await file.arrayBuffer()));

  return filename;
}

export async function readBuyerAgreementFile(transactionId: string, filename: string) {
  return readFile(getStoredAgreementPath(transactionId, filename));
}

export function getAgreementContentType(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  if (extension === ".pdf") {
    return "application/pdf";
  }

  if (extension === ".doc") {
    return "application/msword";
  }

  if (extension === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  return "application/octet-stream";
}
