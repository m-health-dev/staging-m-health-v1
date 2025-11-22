export async function EmailSignUp(formData: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    return {
      message: data.message,
    };
  } catch (error) {
    console.error("Sign Up API Error:", error);
    return { message: "(Sign Up) Terjadi kesalahan saat terhubung ke server." };
  }
}
