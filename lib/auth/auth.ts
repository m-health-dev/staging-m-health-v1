"use client";

const apiBaseUrl = process.env.NEXT_PUBLIC_PROD_BACKEND_URL;

export async function getAuthClient() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/me`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (res.status === 401) {
      console.log("[v0] User not authenticated (401)");
      return null;
    }

    const data = await res.json();
    console.log("[v0] Auth client - User:", data?.email || data?.id);
    return data;
  } catch (error) {
    console.error("[v0] Get auth client error:", error);
    return null;
  }
}

export async function emailLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    console.log("[v0] Starting login...");

    // Step 1: Get CSRF token
    const csrfRes = await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!csrfRes.ok) {
      console.error("[v0] CSRF fetch failed");
    }

    // Step 2: Login with credentials
    const res = await fetch(`${apiBaseUrl}/api/v1/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("[v0] Login response:", res.status, data?.message);

    return data;
  } catch (error) {
    console.error("[v0] Login error:", error);
    return { message: "Connection error", error: String(error) };
  }
}

export async function emailSignUp({
  fullname,
  email,
  password,
}: {
  fullname: string;
  email: string;
  password: string;
}) {
  try {
    console.log("[v0] Starting signup...");

    const res = await fetch(`${apiBaseUrl}/api/v1/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ fullname, email, password }),
    });

    const data = await res.json();
    console.log("[v0] Signup response:", res.status, data?.message);

    return data;
  } catch (error) {
    console.error("[v0] Signup error:", error);
    return { message: "Connection error", error: String(error) };
  }
}

export async function logout() {
  try {
    console.log("[v0] Starting logout...");

    const res = await fetch(`${apiBaseUrl}/api/v1/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    console.log("[v0] Logout response:", res.status);
    return res.ok;
  } catch (error) {
    console.error("[v0] Logout error:", error);
    return false;
  }
}
