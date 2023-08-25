import React, { useState } from "react";
import ConvertButton from "./components/ConvertButton/ConvertButton";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import FileInput from "./components/FileInput/FileInput";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const handleFileUpload = (files) => {
    setUploadedFiles(Array.from(files)); // Convert the FileList to an array
  };

  console.log(uploadedFiles);

  const handleConvert = () => {
    const combined = [];
    const readerPromises = [];

    uploadedFiles.forEach((file) => {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = (event) => {
          const data = JSON.parse(event.target.result);
          combined.push(...data);
          resolve();
        };
      });

      reader.readAsText(file);
      readerPromises.push(promise);
    });

    Promise.all(readerPromises).then(() => {
      setCombinedData(combined);
    });
  };

  return (
    <div>
      <h1>JSON Converter App</h1>
      <FileInput onFileUpload={handleFileUpload} />
      <ConvertButton onConvert={handleConvert} />
      {combinedData.length > 0 && <DownloadButton jsonData={combinedData} />}
    </div>
  );
}

export default App;
