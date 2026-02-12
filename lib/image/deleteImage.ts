const intApiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export async function deleteSingleFile(path: string) {
  try {
    // Pass the full path/URL — the API will extract the correct S3 key
    const res = await fetch(`${intApiBaseUrl}/api/image/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    return res.ok;
  } catch (err) {
    console.error("Delete single file failed", err);
    return false;
  }
}

export async function deleteMultipleFiles(paths: string[]) {
  try {
    // Pass the full paths/URLs — the API will extract the correct S3 keys
    const res = await fetch(`${intApiBaseUrl}/api/image/delete/batch`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });

    return res.ok;
  } catch (err) {
    console.error("Delete multiple files failed", err);
    return false;
  }
}
