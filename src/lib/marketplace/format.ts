export function formatCurrency(amount: number) {
  return `R ${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function parseCurrency(value: string) {
  return Number(value.replace(/[^\d.-]/g, ""));
}
