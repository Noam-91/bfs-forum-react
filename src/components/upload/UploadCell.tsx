import { uid } from 'uid';
import {type ChangeEvent, useRef, useState } from 'react';

const UploadCell = (props: { handleUpload: (url: string) => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const uploadHandler = async () => {
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
        const publicUrl = presignedUrl.split("?")[0];
        props.handleUpload(publicUrl);
    };

    return (
        <div>
            <label htmlFor="upload-input">
                <p>{inputRef.current?.value || 'Please Upload Image'}</p>
                <button onClick={() => inputRef.current?.click()}>Choose File</button>
            </label>
            <input
                ref={inputRef}
                id="upload-input"
                accept="image/*"
                type="file"
                onChange={selectFileHandler}
                className="hidden"
            />
            <button onClick={uploadHandler}>Upload</button>
        </div>
    );
};

export default UploadCell;