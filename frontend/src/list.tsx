import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import "./list.css";

interface File {
  id: bigint;
  originalFileName: string;
  bucketFileName: string;
  link: string;
}

function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function getData() {
      await fetch("http://localhost:8080/files", {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((data) => setFiles(data));
    }

    getData();
  }, []);

  return (
    <div className="list-container">
      {files.map((f: File) => (
        <div className="list-component" key={f.id}>
          <a
            href={`http://localhost:8080/files/${f.bucketFileName}`}
            download="Example-PDF-document"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outlined">Download</Button>
          </a>
          {f.originalFileName}
        </div>
      ))}
    </div>
  );
}

export default FileList;
