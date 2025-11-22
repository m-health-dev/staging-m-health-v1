import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function getAuthClient() {
  const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 401) return null;
  return res.json();
}

export async function EmailLogIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
      credentials: "include",
    });

    const res = await fetch(`${apiBaseUrl}/api/v1/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Log In API Error:", error);
    return { message: "(Log In) Terjadi kesalahan saat terhubung ke server." };
  }
}

export async function EmailSignUp({
  fullname,
  email,
  password,
}: {
  fullname: string;
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Sign Up API Error:", error);
    return { message: "(Sign Up) Terjadi kesalahan saat terhubung ke server." };
  }
}
