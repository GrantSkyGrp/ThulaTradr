import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadRoot = path.join(process.cwd(), "data", "uploads", "payment-proofs");

export function sanitizeUploadedFilename(filename: string) {
  return filename
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function getStoredProofPath(transactionId: string, filename: string) {
  const safeTransactionId = transactionId.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(uploadRoot, safeTransactionId, sanitizeUploadedFilename(filename));
}

export async function savePaymentProofFile(transactionId: string, file: File) {
  const filename = sanitizeUploadedFilename(file.name);
  const storedPath = getStoredProofPath(transactionId, filename);

  await mkdir(path.dirname(storedPath), { recursive: true });
  await writeFile(storedPath, Buffer.from(await file.arrayBuffer()));

  return filename;
}

export async function readPaymentProofFile(transactionId: string, filename: string) {
  return readFile(getStoredProofPath(transactionId, filename));
}

export function getPaymentProofContentType(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  if (extension === ".pdf") {
    return "application/pdf";
  }

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  return "application/octet-stream";
}
