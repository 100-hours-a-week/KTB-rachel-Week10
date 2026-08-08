import React, { useState } from 'react';
import '../../css/image-slider.css';

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className="image-slider-container" onClick={(e) => e.stopPropagation()}>
      <div 
        className="image-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => {
          const src = img instanceof File ? URL.createObjectURL(img) : img;
          return (
            <div key={idx} className="image-slider-slide">
              <img src={src} alt={`slide-${idx}`} className="image-slider-image" />
            </div>
          );
        })}
      </div>

      {images.length > 1 && (
        <>
          <button type="button" className="image-slider-btn left" onClick={prevSlide}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" className="image-slider-btn right" onClick={nextSlide}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="image-slider-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`image-slider-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => goToSlide(e, idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
