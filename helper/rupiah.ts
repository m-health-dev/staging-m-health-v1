export const formatRupiah = (value: string | number) => {
  const number = value.toString().replace(/[^0-9]/g, "");
  if (!number) return "Rp ";
  return "Rp " + number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const removeRupiahFormat = (value: string) =>
  value.replace(/Rp\s?/g, "").replace(/\./g, "");

export function calculateDiscount(real: number, disc: number) {
  const result = Math.round((disc / real) * 100);
  const calc = 100 - result;
  const response = `${calc}%`;

  return response;
}

export function calculateTaxes(price: number, tax: number) {
  const result = Math.round(price * (tax / 100));
  const response = result;

  return response;
}

export function formatRupiah2(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}
