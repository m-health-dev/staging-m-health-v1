export interface RumahSakit {
  kode: string;
  nama: string;
  nama_prop: string;
  kab: string;
  alamat: string;
  TELEPON: string;
  pemilik: string;
  kelas: string;
}

export async function getDummyRS(): Promise<{ data: RumahSakit[] }> {
  const res = await fetch(
    `https://sirs.kemkes.go.id/fo/home/rekap_rs_all?id=0`,
    {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch Dummy RS Data");

  return res.json();
}

export async function getRSByProvince(
  provinceName: string
): Promise<RumahSakit[]> {
  const rs = await getDummyRS();

  const filtered = rs.data.filter((item) => item.nama_prop === provinceName);

  return filtered;
}

export async function getRSByCity(cityName: string): Promise<RumahSakit[]> {
  const rs = await getDummyRS();

  const filtered = rs.data.filter((item) => item.kab === cityName);

  return filtered;
}
