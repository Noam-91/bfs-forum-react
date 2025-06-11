// s3Upload.ts
export const uploadFileToS3 = async (file: File): Promise<string> => {
  // 1. retrieve URL
  const res = await fetch('/api/s3/presign', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      filetype: file.type,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { uploadUrl, fileUrl } = await res.json();

  // 2. S3 upload
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // 3. return fileUrl accessed by all
  return fileUrl;
};