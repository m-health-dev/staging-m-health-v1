export function getAgeDetail(dateOfBirth: Date) {
  const today = new Date();

  let years = today.getFullYear() - dateOfBirth.getFullYear();
  let months = today.getMonth() - dateOfBirth.getMonth();
  let days = today.getDate() - dateOfBirth.getDate();

  // Jika tanggal bulan ini belum lewat → kurangi 1 bulan
  if (days < 0) {
    months--;
  }

  // Jika bulan belum lewat → kurangi 1 tahun
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
}
