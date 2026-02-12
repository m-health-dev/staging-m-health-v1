import { apiSecretKey } from "@/helper/api-secret-key";

const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function getUserInfo(token: string) {
  const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
    // next: { revalidate: 1 },
    headers: {
      "X-API-Key": apiSecretKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch User Data");
  return res.json();
}

// export async function getUserInfo(token: string) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     const userID = user?.id;

//     const { data: accaountData, error } = await supabase
//       .from("accounts")
//       .select("*")
//       .eq("id", userID)
//       .single();

//     if (error) {
//       throw error;
//     }

//     console.log("Account Data:", accaountData);

//     return accaountData;
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     throw new Error("Failed to fetch User Data");
//   }
// }
