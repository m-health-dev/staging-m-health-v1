import { cookies } from "next/headers";

const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

// export async function getAuth() {
//   const cookieStore = cookies();
//   const cookieHeader = cookieStore.toString();

//   const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Cookie: cookieHeader, // Kirim cookie user ke backend
//     },
//     credentials: "include",
//     cache: "no-store", // penting agar tidak cache session lama
//   });

//   if (res.status === 401) {
//     return null;
//   }

//   if (!res.ok) {
//     throw new Error("Failed to fetch User Data");
//   }

//   return res.json();
// }

export async function getAuth() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/me`,
      {
        method: "GET",
        credentials: "include", // WAJIB untuk sanctum
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}
