const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;

export async function imageUpload(payload: {
  file: File[]; // biasanya File atau Blob
  model: string;
  field: string;
}) {
  try {
    const formData = new FormData();

    // kalau multiple file
    payload.file.forEach((f) => {
      formData.append("file", f);
    });

    // field text lain juga bisa
    formData.append("model", payload.model);
    formData.append("field", payload.field);

    const res = await fetch(`${apiBaseUrl}/api/v1/{modules}/upload`, {
      method: "POST",
      body: formData, // ❗ tanpa headers content-type
    });

    const data = await res.json();
    return { data };
  } catch (error) {
    console.error("Error Upload Image API:", error);
    return { message: "Terjadi kesalahan saat terhubung ke server." };
  }
}
