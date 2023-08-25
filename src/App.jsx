import { useState } from "react";
import ConvertButton from "./components/ConvertButton/ConvertButton";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import FileInput from "./components/FileInput/FileInput";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const handleFileUpload = (files) => {
    setUploadedFiles(Array.from(files)); // Convert the FileList to an array
  };

  const handleConvert = () => {
    const combined = [];
    const readerPromises = [];

    uploadedFiles.forEach((file) => {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = (event) => {
          const data = JSON.parse(event.target.result);

          if (Array.isArray(data)) {
            combined.push(...data);
          } else {
            // If data is not an array, convert it to an array
            const dataArray = Array.isArray(data) ? data : [data];
            combined.push(...dataArray);
          }

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

  const handleDownload = () => {
    setUploadedFiles([]); // Reset uploadedFiles state
    setCombinedData([]); // Reset combinedData state
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>JSON Converter App</h1>
      <FileInput onFileUpload={handleFileUpload} />
      <ConvertButton onConvert={handleConvert} />
      {combinedData.length > 0 && (
        <DownloadButton jsonData={combinedData} onDownload={handleDownload} />
      )}
    </div>
  );
}

export default App;
