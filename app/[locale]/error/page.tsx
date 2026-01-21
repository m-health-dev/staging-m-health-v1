export default async function Page() {
  const res = await fetch(`https://...`);
  const data = await res.json();

  if (!res.ok) {
    return "There was an error.";
  }

  return "...";
}
