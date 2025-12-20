export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL! as string;

export const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_BACKEND_URL
    : process.env.DEV_BACKEND_URL;
