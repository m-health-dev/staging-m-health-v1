export async function getCurrentTime(): Promise<string> {
  const now = await fetch("https://time.now/developer/api/ip", {
    next: { revalidate: 10, tags: ["time"] },
  }).then((res) => res.json());
  return now.utc_datetime;
}
