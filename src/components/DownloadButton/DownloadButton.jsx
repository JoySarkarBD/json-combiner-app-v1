import React from "react";

function DownloadButton({ jsonData }) {
  const downloadJsonFile = () => {
    const blob = new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "combined.json";
    a.click();
  };

  return <button onClick={downloadJsonFile}>Download Combined JSON</button>;
}

export default DownloadButton;
