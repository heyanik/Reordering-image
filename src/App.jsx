import React from "react";
import "./App.css";
import ImageGallery from "./components/ImageGallery";
import imageData from "./Data";

function App() {
  return (
    <div className="App">
      <h1>Ollyo Assignment</h1>
      <ImageGallery
        images={imageData}
        featureImageIndex={0}
        onImageClick={(index) => handleImageClick(index)}
      />
    </div>
  );
}

export default App;
