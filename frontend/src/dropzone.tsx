import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./dropzone.css";
import { Button } from "@mui/material";

function FileDropzone() {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  async function handleOnClick(e: React.SyntheticEvent) {
    e.preventDefault();

    if (typeof acceptedFiles[0] === "undefined") return;

    const formData = new FormData();

    acceptedFiles.map((f) => {
      formData.append("files", f);
    });

    await fetch("http://localhost:8080/files", {
      method: "POST",
      body: formData,
    }).then(() => {
      acceptedFiles.splice(0, acceptedFiles.length);
      setTimeout(function () {
        window.location.reload();
      });
    });
  }

  return (
    <div className="file-dropzone-container">
      <div className="drop-container" {...getRootProps()}>
        <input {...getInputProps()} />
        {acceptedFiles &&
        Array.isArray(acceptedFiles) &&
        acceptedFiles.length ? (
          <div className="selected-file">
            {acceptedFiles.length > 3
              ? `${acceptedFiles.length} files`
              : acceptedFiles.map((file) => file.name).join(", ")}
          </div>
        ) : (
          `Drag and drop files here, or click to select files`
        )}
      </div>
      <aside className="selected-file-wrapper">
        <Button
          variant="outlined"
          disabled={!acceptedFiles}
          onClick={handleOnClick}
        >
          Upload
        </Button>
      </aside>
    </div>
  );
}

export default FileDropzone;
