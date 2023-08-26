/* eslint-disable no-unused-vars */
import React, { useCallback, useRef, useState } from "react";
import "./App.css";
import ConvertButton from "./components/ConvertButton/ConvertButton";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import FileInput from "./components/FileInput/FileInput";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const formRef = useRef(null); // Create a ref for the form element

  const handleFileUpload = useCallback((files) => {
    setErrorMessage("");
    setUploadedFiles(Array.from(files)); // Convert the FileList to an array
  }, []);

  const handleConvert = useCallback(
    async (event) => {
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
              try {
                const data = JSON.parse(event.target.result);

                if (Array.isArray(data)) {
                  combined.push(...data);
                } else {
                  const dataArray = Array.isArray(data) ? data : [data];
                  combined.push(...dataArray);
                }
              } catch (error) {
                // Handle parsing error
                console.error("Error parsing JSON:", error);
                setErrorMessage("Invalid JSON format"); // Set the error message
                setUploadedFiles([]); // Clear uploaded files
                setCombinedData([]); // Clear combined data
                formRef.current.reset(); // Reset the form

                return;
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
    },
    [uploadedFiles]
  );

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

  console.log(combinedData);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4 text-center mt-9 text-white'>
        JSON Converter App
      </h1>

      <p className='mt-4 mb-5 text-lg font-normal text-center text-gray-200'>
        Introducing our cutting-edge JSON Converter Web App – your ultimate
        solution for seamless <br /> data transformation! Whether you are a
        developer, data analyst, or simply someone dealing with data <br />
        interchange, our tool empowers you to effortlessly convert, manipulate,
        and visualize JSON data <br /> with unparalleled ease.
      </p>
      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleDownload}
        className='form-container mx-auto mt-5'>
        <div className='upload-files-container'>
          {/* File Input Filed */}
          <FileInput onFileUpload={handleFileUpload} />
          {errorMessage === "" ? (
            ""
          ) : (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mt-2'
              role='alert'>
              <strong className='font-bold'>Holy smokes!</strong>
              <br />
              <span className='block sm:inline'>{errorMessage}</span>
            </div>
          )}
          {/* Convert Button */}
          <ConvertButton onConvert={handleConvert} />

          {/* Download Button */}
          {errorMessage === "" && combinedData.length > 0 && (
            <DownloadButton
              jsonData={combinedData}
              onDownload={handleFormReset}
            />
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
