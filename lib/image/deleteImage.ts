export async function deleteSingleFile(path: string) {
  try {
    const clearPath = path.replaceAll(
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!,
      ""
    );
    const res = await fetch("/api/image/delete", {
      method: "DELETE",
      body: JSON.stringify({ path: clearPath }),
    });

    return res.ok;
  } catch (err) {
    console.error("Delete single file failed", err);
    return false;
  }
}

export async function deleteMultipleFiles(paths: string[]) {
  try {
    const clearPaths = paths.map((p) =>
      p.replaceAll(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL!, "")
    );

    const res = await fetch("/api/image/delete/batch", {
      method: "DELETE",
      body: JSON.stringify({ paths: clearPaths }),
    });

    return res.ok;
  } catch (err) {
    console.error("Delete multiple files failed", err);
    return false;
  }
}
