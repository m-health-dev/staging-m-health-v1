export async function EmailLogIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Log In API Error:", error);
    return { message: "(Log In) Terjadi kesalahan saat terhubung ke server." };
  }
}
