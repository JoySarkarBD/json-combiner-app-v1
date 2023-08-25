/* eslint-disable react/prop-types */
// Inside the DownloadButton component
function DownloadButton({ jsonData, onDownload }) {
  const downloadJsonFile = () => {
    const blob = new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "combined.json";
    a.click();
    onDownload(); // Call the onDownload callback after downloading
  };

  return (
    <button
      className='bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600 mt-5'
      onClick={downloadJsonFile}>
      Download Combined JSON
    </button>
  );
}

export default DownloadButton;
