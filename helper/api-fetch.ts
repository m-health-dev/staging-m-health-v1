import { API_INTERNAL_HEADER, API_INTERNAL_VALUE } from "@/helper/api-guard";

/**
 * Wrapper around `fetch` that automatically adds the internal API header.
 * Use this for all client-side calls to `/api/*` routes.
 *
 * Usage:
 * ```ts
 * import { apiFetch } from "@/helper/api-fetch";
 *
 * const res = await apiFetch("/api/encrypt-price", {
 *   method: "POST",
 *   body: JSON.stringify({ price: 100000 }),
 * });
 * ```
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set(API_INTERNAL_HEADER, API_INTERNAL_VALUE);
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  return fetch(input, {
    ...init,
    headers,
  });
}
