import React from "react";

function ConvertButton({ onConvert }) {
  return (
    <button
      className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
      onClick={onConvert}>
      Convert
    </button>
  );
}

export default ConvertButton;
