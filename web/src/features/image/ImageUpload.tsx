import { client } from "@/client";
import { useState } from "react";

export function Upload({ onUpdate }: { onUpdate: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await upload(file);
      onUpdate(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("ファイルのアップロードに失敗しました。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="rounded bg-blue-200 px-4 py-2 hover:bg-blue-300"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export async function upload(file: File): Promise<string> {
  const res = await client.image.put.$get();
  const { url: putURL, fileName: key } = await res.json();

  const uploadResponse = await fetch(putURL, {
    method: "PUT",
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload failed");
  }
  console.log("upload response:", await uploadResponse.text());

  // TODO: make it valid forever by making it public
  return await getReadURL(key);
}

async function getReadURL(key: string) {
  const { url } = await (await client.image.get.$get({ query: { key } })).json();
  return url;
}
