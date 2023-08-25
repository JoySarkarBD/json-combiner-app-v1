import React, { useCallback, useRef, useState } from "react";
import ConvertButton from "./components/ConvertButton/ConvertButton";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import FileInput from "./components/FileInput/FileInput";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const formRef = useRef(null); // Create a ref for the form element

  const handleFileUpload = useCallback((files) => {
    setUploadedFiles(Array.from(files)); // Convert the FileList to an array
  }, []);

  const handleConvert = useCallback(async () => {
    event.preventDefault(); // Prevent form submission
    const combined = [];
    const readerPromises = [];
    const batchSize = 10; // Number of files to process in one batch

    for (let i = 0; i < uploadedFiles.length; i += batchSize) {
      const batch = uploadedFiles.slice(i, i + batchSize);
      const batchReaderPromises = [];

      batch.forEach((file) => {
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
          reader.onload = (event) => {
            const data = JSON.parse(event.target.result);

            if (Array.isArray(data)) {
              combined.push(...data);
            } else {
              const dataArray = Array.isArray(data) ? data : [data];
              combined.push(...dataArray);
            }

            resolve();
          };
        });

        reader.readAsText(file);
        batchReaderPromises.push(promise);
      });

      await Promise.all(batchReaderPromises);
    }

    setCombinedData(combined);
  }, [uploadedFiles]);

  const handleDownload = useCallback(() => {
    setUploadedFiles([]);
    setCombinedData([]);
  }, []);

  // Inside the App component
  const handleFormReset = () => {
    formRef.current.reset(); // Reset the form
    setUploadedFiles([]); // Clear uploaded files
    setCombinedData([]); // Clear combined data
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>JSON Converter App</h1>
      <form ref={formRef} onSubmit={handleDownload}>
        {" "}
        {/* Attach onSubmit handler */}
        <FileInput onFileUpload={handleFileUpload} />
        <ConvertButton onConvert={handleConvert} />
        {combinedData.length > 0 && (
          <DownloadButton
            jsonData={combinedData}
            onDownload={handleFormReset}
          />
        )}
      </form>
    </div>
  );
}

export default App;
