export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ") // hapus semua tag HTML
    .replace(/\s+/g, " ") // rapikan spasi
    .trim();
}
