import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ImageGallery.css";

//function for sort the images inside the gallery
function SortableImage({
  index,
  image,
  featureImage,
  onImageClick,
  onImageMove,
  selected,
  onSelectImage,
}) {
  const [, ref] = useDrag({
    type: "image",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "image",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onImageMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleSelectImage = () => {
    onSelectImage(index);
  };

  return (
    <div
      ref={(node) => {
        ref(drop(node));
      }}
      className={`image ${featureImage ? "feature-image" : ""} ${
        selected ? "" : ""
      }`}
      onClick={() => onImageClick(index)}
    >
      <div className="image-container" onClick={handleSelectImage}>
        <input
          type="checkbox"
          checked={selected}
          className="show-checkbox"
          onChange={() => {}}
        />
        <img src={image} alt={`Image ${index}`} />
      </div>
    </div>
  );
}

function ImageGallery({ images, featureImageIndex, onImageClick }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [reorderedImages, setReorderedImages] = useState([...images]);
  const [textHidden, setTextHidden] = useState(true);

  const handleImageMove = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) {
      return;
    }

    // Swap the positions of the images
    const updatedImages = [...reorderedImages];
    [updatedImages[fromIndex], updatedImages[toIndex]] = [
      updatedImages[toIndex],
      updatedImages[fromIndex],
    ];

    setReorderedImages(updatedImages);

    // Update the feature image index if necessary
    let updatedFeatureImageIndex = featureImageIndex;
    if (fromIndex === featureImageIndex) {
      updatedFeatureImageIndex = toIndex;
    } else if (toIndex === featureImageIndex) {
      updatedFeatureImageIndex = fromIndex;
    }

    setFeatureImageIndex(updatedFeatureImageIndex);
    setTextHidden(true); // Hide the text when images are moved
  };

  const handleDeleteImages = () => {
    // Delete selected images
    const updatedImages = reorderedImages.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setReorderedImages(updatedImages);
    setSelectedImages([]);
    setTextHidden(true); // Hide the text after deleting images
  };

  const handleSelectImage = (index) => {
    // Check if the selected image is already in the selectedImages array
    const isSelected = selectedImages.includes(index);

    // Select or deselect the image
    if (isSelected) {
      setSelectedImages(
        selectedImages.filter((selected) => selected !== index)
      );
    } else {
      setSelectedImages([...selectedImages, index]);
    }

    // Check if there are no selected images left
    if (selectedImages.length === 1 && isSelected) {
      setTextHidden(true); // Hide the text when all images are deselected
    } else {
      setTextHidden(false); // Show the text when at least one image is selected
    }
  };

  // const selectedImageCount = selectedImages.length;

  return (
    <div className="container">
      <div className="container-top">
        {/* {textHidden ? (
          <p>Gallery</p>
        ) : (
          <p>{selectedImages.length} Files Selected</p>
        )} */}
        <div className="slct-sec">
          {!textHidden ? (
            <>
              <input
                type="checkbox"
                checked={selectedImages.length > 0}
                onChange={() => {}}
              />
              <p>{selectedImages.length} Files Selected</p>
            </>
          ) : (
            <p>Gallery</p>
          )}
        </div>

        <button onClick={handleDeleteImages}>Delete files</button>
      </div>
      <div className="gallery">
        <DndProvider backend={HTML5Backend}>
          <div className="image-gallery">
            {reorderedImages.map((image, index) => (
              <SortableImage
                key={index}
                index={index}
                image={image}
                featureImage={index === featureImageIndex}
                onImageClick={onImageClick}
                onImageMove={handleImageMove}
                selected={selectedImages.includes(index)}
                onSelectImage={handleSelectImage}
              />
            ))}
            {/* <button className="btn"></button> */}
          </div>
        </DndProvider>
      </div>
    </div>
  );
}

export default ImageGallery;
