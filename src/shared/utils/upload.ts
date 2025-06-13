import {uid} from "uid";

export const uploadFile = async (file: File) => {
    if (!file) return;
    const fileName = `${uid(9)}-${file.name}`;
    const presignedUrl = await fetch(`http://localhost:8080/files/upload`, {
        method: "POST",
        body: JSON.stringify({ fileName, contentType: file.type }),
        headers: { "Content-Type": "application/json" },
    }).then(res => res.text());
    await fetch(presignedUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read"
        },
        body: file,
    });
    return presignedUrl.split("?")[0];
}