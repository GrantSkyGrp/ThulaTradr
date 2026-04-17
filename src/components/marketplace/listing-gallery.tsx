"use client";

import { useState } from "react";

type ListingGalleryProps = {
  model: string;
  imageUrls: string[];
};

export function ListingGallery({ model, imageUrls }: ListingGalleryProps) {
  const [activeImage, setActiveImage] = useState(imageUrls[0] ?? "");

  return (
    <div className="listing-gallery">
      <div className="listing-gallery__thumbs">
        {imageUrls.map((imageUrl, index) => (
          <button
            key={imageUrl}
            type="button"
            className={`listing-thumb${activeImage === imageUrl ? " listing-thumb--active" : ""}`}
            onClick={() => setActiveImage(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`${model} view ${index + 1}`}
              className="listing-thumb__image"
            />
          </button>
        ))}
      </div>

      <div className="listing-gallery__stage">
        {activeImage ? (
          <img
            src={activeImage}
            alt={`${model} main view`}
            className="listing-gallery__image"
          />
        ) : null}
      </div>
    </div>
  );
}
