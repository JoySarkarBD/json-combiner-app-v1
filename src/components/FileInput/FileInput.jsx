import React from "react";

function FileInput({ onFileUpload }) {
  const handleFileChange = (event) => {
    const files = event.target.files;
    onFileUpload(files);
  };

  return (
    <input
      className='border p-2 rounded'
      type='file'
      accept='.json'
      multiple
      onChange={handleFileChange}
    />
  );
}

export default FileInput;
